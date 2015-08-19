@Loading = new ReactiveObj({loadingState: false})
Template.ice_orderUpdateTemplate.onRendered ->
  text = $('[name="iceCustomerId"] option:selected').text()
  $('[name="customer"]').val(text)
Template.ice_order.onRendered ->
   createNewAlertify(['order','staffAddOn','customerAddOn', 'paymentPopUP'])

Template.ice_orderInsertTemplate.helpers
  loading: ->
    Loading.get('loadingState')

Template.ice_orderInsertTemplate.onRendered ->
  id = Session.get('ice_customer_id');
  exhchange_date = Cpanel.Collection.Exchange.findOne({}, {sort: {dateTime: -1}})
  today = moment().format('YYYY-MM-DD HH:mm:ss') 
  $('[name="exchange"]').select2('val', exhchange_date._id)
  $('[name="orderDate"]').val(today)
  total = $('[name="total"]').val()
  if total != ''
    totalAmount()
  if checkType(id) == 'general'
    $('.pay').removeClass('hidden')
    $('.saveNpay').removeClass('hidden')
  else
    $('.pay').addClass('hidden')   
    $('.saveNpay').addClass('hidden')   
  $('body').on 'keydown', (e) -> 
    if(e.keyCode == 123)
      $('.importPayment').slideDown('fast')
    else
      $('.importPayment').hide()
  createNewAlertify(['staffAddOn','customerAddOn', 'paymentPopUP'])
  datePicker()

Template.ice_order.events
  "click .insert": ->
    Router.go('ice.customer')
  "click .update": ->
    orderId = this._id
    data = Ice.Collection.Order.findOne(orderId);
    id = this._id
    if this._customer.customerType == 'general'
      if(data.paidAmount == 0)
        alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderUpdateTemplate,data))
        .maximize()
      else
        alertify.warning('Sorry , invoice ' + id + ' has payment')
    else
      orderGroupId = data.iceOrderGroupId
      group = Ice.Collection.OrderGroup.findOne(orderGroupId);
      discount = 0 
      if(group.paidAmount == 0)
        order = {}
        order.items = {};
        order.discount = 0
        if data.discount isnt undefined
          order.discount = data.discount
        order.total = data.total
        order.totalInDollar = data.totalInDollar
        data.iceOrderDetail.forEach (item) ->
          if item.discount isnt undefined
            discount = item.discount
          order.items[item.iceItemId] =
            qty: item.qty
            amount:item.amount
            price: item.price
            discount: discount
        Session.set 'oldOrderValue', order
        Session.set 'iceOrderGroupId', orderGroupId
        alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderUpdateTemplate,data))
        .maximize()
      else
        alertify.warning('Sorry , invoice ' + id + ' has payment')

    $('[name="total"]').attr('readonly', true)
  "click .remove": ->
    id = @_id
    paidAmount = undefined
    data = Ice.Collection.Order.findOne(id)
    if data.iceOrderGroupId != undefined
      paidAmount = Ice.Collection.OrderGroup.findOne({_id: data.iceOrderGroupId }).paidAmount 
    else
      paidAmount = data.paidAmount
    if paidAmount == 0
      userId = Meteor.userId()
      userName = Meteor.users.findOne(userId).username;
      selector = 
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        data: data 
        removedBy: 
          id: userId 
          name: userName 
      alertify.confirm(
        fa('remove', 'Remove order'),
        "Are you sure to delete "+id+" ?",
        ->
          Ice.Collection.Order.remove id, (error) ->
            if error is 'undefined' 
              alertify.error error.message 
            else
              Ice.Collection.RemoveInvoiceLog.insert(selector)
              alertify.warning 'Successfully Remove'
        null
      )
    else
      alertify.error "Invoice ##{id} has payment"
  'click .show': () ->
    doc = Ice.Collection.Order.findOne(@_id)
    alertify.alert(fa('eye', 'Order detail'), renderTemplate(Template.ice_orderShowTemplate, doc))    
  "click .print": ->
    Session.set('invioceReportId', null)
    GenReport(@_id) #generateReport alias function in order_autoform_hook
  'click .save': ->
    Loading.set('loadingState', true)
    Session.set('invioceReportId', null)
  'click .saveNpay': -> 
    debugger
    # doc = Ice.Collection.Order.findOne(id)
    # alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, doc))
# insert form event
Template.ice_orderInsertTemplate.events
  'click .reset': ->
    $('select').each ->
      $(this).select2('val', '')
  'click .orderPayment': ->
    Meteor.call('migrateOrder')
  'click .orderGroupPayment': ->
    Meteor.call('migrateOrderGroup')
  'click .removeOrderPayment': ->
    Meteor.call('removeMigrateFromOrder')
  'click .staffAddon': () ->
      alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate))
  'click .customerAddon': () ->
      alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(Template.ice_insertTemplate))
  'change .item': (event) ->
    current = $(event.currentTarget)
    if current.val() != ''
      item = Ice.Collection.Item.findOne(current.val())
      item.qty = 1 
      item.amount = item.price * item.qty 
      current.parents('.array-item').find('.price').val(item.price)
      current.parents('.array-item').find('.qty').val(item.qty)
      current.parents('.array-item').find('.amount').val(roundKhr(item.amount))
      current.parents('.array-item').find('.discount').val('')
      totalAmount()
  'keyup .qty': (event) ->
    current = $(event.currentTarget)
    itemQty(current)

  'keyup .price': (event) ->
    current = $(event.currentTarget)
    itemPrice(current)
    

  'keyup .discount': (event) ->
    current = $(event.currentTarget)
    itemDiscount(current)
  'keyup [name="discount"]': (event) ->
    totalAmount()
  'click .btnRemove' : ->
    setTimeout(-> totalAmount()
    200)
    
  'click .print': ->
    Print.set 'print', true
  'click .save': ->
    Loading.set('loadingState', true)

  'click .pay': ->
    Loading.set('loadingState', true)
    Print.set 'pay', true
  'click .saveNpay': ->
    Loading.set('loadingState', true)
    Print.set 'saveNpay', true

  'change [name="exchange"]': (event) ->
    val = findExchange($(event.currentTarget).val())
    total = $('[name="total"]').val()
    if total != ''
      total = parseFloat(total) 
      if val.base is 'KHR'
        amount = total * val.rates["USD"]
        $('[name="totalInDollar"]').val(math.round(amount, 2))

# Update form event
Template.ice_orderUpdateTemplate.events
  'click .staffAddon': () ->
      alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate))
  'click .customerAddon': () ->
      alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(Template.ice_insertTemplate))

  'change [name="iceCustomerId"]': (e) ->
    id = $(e.currentTarget).val()
    exhchange_date = Cpanel.Collection.Exchange.findOne({}, {sort: {dateTime: -1}})
    $('[name="exchange"]').select2('val', exhchange_date._id)
    if checkType(id) == 'general'
      $('.pay').removeClass('hidden')
    else
      $('.pay').addClass('hidden')
  'change .item': (event) ->
    current = $(event.currentTarget)
    item = Ice.Collection.Item.findOne(current.val())
    item.qty = 1 
    item.amount = item.price * item.qty 
    current.parents('.array-item').find('.price').val(item.price)
    current.parents('.array-item').find('.qty').val(item.qty)
    current.parents('.array-item').find('.amount').val(item.amount)
    current.parents('.array-item').find('.discount').val('')
    totalAmount()
  'keyup .qty': (event) ->
    current = $(event.currentTarget)
    itemQty(current)

  'keyup .price': (event) ->
    current = $(event.currentTarget)
    itemPrice(current)
    

  'keyup .discount': (event) ->
    current = $(event.currentTarget)
    itemDiscount(current)
  'keyup [name="discount"]': (event) ->
    totalAmount()
  'click .btnRemove' : ->
    setTimeout(-> totalAmount()
    200)
    
  'click .print': ->
    Print.set 'print', true

  'click .pay': ->
    alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this))

  'change [name="exchange"]': (event) ->
    val = findExchange($(event.currentTarget).val())
    total = parseFloat $('[name="total"]').val()
    totalInDollar = math.round(total * val.rates["USD"], 2)
    if val.base is 'KHR'
      $('[name="totalInDollar"]').val(totalInDollar)

#show
Template.ice_orderShowTemplate.helpers
  iceOrderDetail: () ->
    orderDetail = this.iceOrderDetail
    items = []
    orderDetail.forEach (item) ->
     items.push itemQuery.detail(item.iceItemId, item.price, item.qty, item.discount, format(item.amount))
    items
  customerType: () ->
    customerDoc = Ice.Collection.Customer.findOne(this.iceCustomerId);
    customerDoc.customerType
  discount: () ->
    discount = this.discount
    if discount isnt undefined
      "<p class='label label-success'>"+discount+"%</p>" 
    else
      "<p class='label label-success'>None</p>"

# autoForm hook
# functions
datePicker = ->
  orderDate = $('[name="orderDate"]')
  DateTimePicker.dateTime orderDate

itemDiscount = (current) ->
  currentDiscount = current.val()
  price = parseFloat current.parents('.array-item').find('.price').val()
  qty = parseFloat current.parents('.array-item').find('.qty').val()
  amount = roundKhr(price * qty)
  if currentDiscount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((price* qty) * parseFloat currentDiscount)/100)
  totalAmount()
itemPrice = (current) ->
  currentPrice = parseFloat current.val()
  qty = parseFloat current.parents('.array-item').find('.qty').val()
  discount = current.parents('.array-item').find('.discount').val()
  amount = roundKhr(qty * currentPrice)
  if discount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((currentPrice* qty) * parseFloat discount)/100)
  totalAmount()
itemQty = (current) ->
  currentQty = parseFloat current.val()
  price = parseFloat current.parents('.array-item').find('.price').val()
  discount = current.parents('.array-item').find('.discount').val()
  amount = roundKhr(currentQty * price)
  if discount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((price* currentQty) * parseFloat discount)/100)
  totalAmount()
totalAmount = () ->
  total = 0 ;
  $('.amount').each ->
    console.log $(this).val()
    total += parseFloat $(this).val()
  console.log(total)
  $('[name="subtotal"]').val(roundKhr(total))
  subtotal = parseFloat $('[name="subtotal"]').val()
  discount = $('[name="discount"]').val()
  if  discount is ''
    $('[name="total"]').val(roundKhr(total))
  else
    discountAmount = (subtotal - parseFloat discount)
    $('[name="total"]').val(roundKhr(discountAmount))
  displayTotalInDollar($('[name="total"]').val(), findExchange($('[name="exchange"]').val()));

findExchange = (id) ->
  if id isnt ''
    {base, rates} = Cpanel.Collection.Exchange.findOne(id)
    {base, rates}

displayTotalInDollar = (total, exchange) ->
  total = parseFloat(total)
  totalInDollar = $('[name="totalInDollar"]')
  if exchange is undefined
    totalInDollar.val('')
  else 
    if exchange.base is 'KHR'
      value = math.round(total * exchange.rates["USD"], 2)
      totalInDollar.val(value)

checkType = (id) ->
  {customerType: type } = Ice.Collection.Customer.findOne(id)
  type

#item query
itemQuery = 
  detail: (itemId, price, qty, discount = '0', amount) ->
    {name} = Ice.Collection.Item.findOne(itemId)
    "<small>
    {Name:#{name}, 
    Price: #{price}, 
    Qty:#{qty},
    Discount:#{discount},
    Amount: #{amount}}</small>"

format = (value) ->
  numeral(value).format('0,0')
