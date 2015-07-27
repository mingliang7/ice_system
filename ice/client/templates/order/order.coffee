Template.ice_orderInsertTemplate.onRendered ->
  today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') 
  $('[name="orderDate"]').val(today)
  datePicker()
Template.ice_order.onRendered ->
  createNewAlertify(['order','staffAddOn','customerAddOn', 'paymentPopUP'])

Template.ice_order.events
  "click .insert": ->
    alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderInsertTemplate))
    .maximize()
    $('[name="total"]').attr('readonly', true)
  "click .update": ->
    data = Ice.Collection.Order.findOne(this._id);
    id = this.iceCustomerId
    if checkType(id) == 'general'
      alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderUpdateTemplate,data))
      .maximize()
    else
      alertify.warning('Sorry , Customer ' + id + ' is not General :( ')

    $('[name="total"]').attr('readonly', true)
  "click .remove": ->
    id = @_id
    alertify.confirm(
      fa('remove', 'Remove order'),
      "Are you sure to delete "+id+" ?",
      ->
        Ice.Collection.Order.remove id, (error) ->
          if error is 'undefined' then alertify.error error.message else alertify.warning 'Successfully Remove'
      null
    )
  'click .show': () ->
    alertify.alert(fa('eye', 'Order detail'), renderTemplate(Template.ice_orderShowTemplate, @))    
  "click .print": ->
    GenReport(@_id) #generateReport alias function in order_autoform_hook

# insert form event
Template.ice_orderInsertTemplate.events
  'click .staffAddon': () ->
      alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate))
  'click .customerAddon': () ->
      alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(Template.ice_insertTemplate))
    
  'change [name="iceCustomerId"]': (e) ->
    id = $(e.currentTarget).val()
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
  'keyup .qty , change .qty': (event) ->
    current = $(event.currentTarget)
    itemQty(current)

  'keyup .price , change .price': (event) ->
    current = $(event.currentTarget)
    itemPrice(current)
    

  'keyup .discount , change .discount': (event) ->
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
    Print.set 'pay', true

  'change [name="exchange"]': (event) ->
    val = findExchange($(event.currentTarget).val())
    total = parseInt $('[name="total"]').val()
    if val.base is 'KHR'
      $('[name="totalInDollar"]').val(total * val.rates["USD"])

# Update form event
Template.ice_orderUpdateTemplate.events
  'click .staffAddon': () ->
      alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate))
  'click .customerAddon': () ->
      alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(Template.ice_insertTemplate))

  'change [name="iceCustomerId"]': (e) ->
    id = $(e.currentTarget).val()
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
  'keyup .qty , change .qty': (event) ->
    current = $(event.currentTarget)
    itemQty(current)

  'keyup .price , change .price': (event) ->
    current = $(event.currentTarget)
    itemPrice(current)
    

  'keyup .discount , change .discount': (event) ->
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
    total = parseInt $('[name="total"]').val()
    if val.base is 'KHR'
      $('[name="totalInDollar"]').val(total * val.rates["USD"])

#show
Template.ice_orderShowTemplate.helpers
  iceOrderDetail: () ->
    orderDetail = this.iceOrderDetail
    items = []
    orderDetail.forEach (item) ->
     items.push itemQuery.detail(item.iceItemId, item.qty, item.discount, format(item.amount))
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
AutoForm.hooks
  ice_orderInsertTemplate:
    before:
      insert: (doc) ->
        prefix = Session.get('currentBranch')
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 6);
        doc.branchId = Session.get('currentBranch')
        doc

  ice_orderUpdateTemplate:
    onSuccess: (formType, result) ->
      alertify.success 'Successfully Updated'
      alertify.order().close()

    onError: (formType, error) ->
      alertify.error error.message

# functions
datePicker = ->
  orderDate = $('[name="orderDate"]')
  DateTimePicker.dateTime orderDate

itemDiscount = (current) ->
  currentDiscount = current.val()
  price = parseFloat current.parents('.array-item').find('.price').val()
  qty = parseInt current.parents('.array-item').find('.qty').val()
  amount = price * qty
  if currentDiscount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((price* qty) * parseFloat currentDiscount)/100)
  totalAmount()
itemPrice = (current) ->
  currentPrice = parseFloat current.val()
  qty = parseInt current.parents('.array-item').find('.qty').val()
  discount = current.parents('.array-item').find('.discount').val()
  amount = qty * currentPrice
  if discount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((currentPrice* qty) * parseFloat discount)/100)
  totalAmount()
itemQty = (current) ->
  currentQty = parseFloat current.val()
  price = parseFloat current.parents('.array-item').find('.price').val()
  discount = current.parents('.array-item').find('.discount').val()
  amount = currentQty * price
  if discount is ''
    current.parents('.array-item').find('.amount').val(amount)
  else
    current.parents('.array-item').find('.amount').val(amount - ((price* currentQty) * parseFloat discount)/100)
  totalAmount()
totalAmount = () ->
  total = 0 
  $('.amount').each ->
    total += parseFloat $(this).val()
  $('[name="subtotal"]').val(total)
  subtotal = parseFloat $('[name="subtotal"]').val()
  discount = $('[name="discount"]').val()
  if  discount is ''
    $('[name="total"]').val(total)
  else
    discountAmount = (subtotal * parseInt discount)/100
    $('[name="total"]').val(subtotal - discountAmount)
  displayTotalInDollar($('[name="total"]').val(),findExchange($('[name="exchange"]').val()))

findExchange = (id) ->
  if id isnt ''
    {base, rates} = Cpanel.Collection.Exchange.findOne(id)
    {base, rates}

displayTotalInDollar = (total, exchange) ->
  total = parseInt(total)
  totalInDollar = $('[name="totalInDollar"]')
  if exchange is undefined
    totalInDollar.val('')
  else 
    if exchange.base is 'KHR'
      totalInDollar.val(total * exchange.rates["USD"])

checkType = (id) ->
  {customerType: type } = Ice.Collection.Customer.findOne(id)
  type

#item query
itemQuery = 
  detail: (itemId, qty, discount = '0', amount) ->
    {name, price} = Ice.Collection.Item.findOne(itemId)
    "<small>
    {Name:#{name}, 
    Price: #{price}, 
    Qty:#{qty},
    Discount:#{discount},
    Amount: #{amount}}</small>"

format = (value) ->
  numeral(value).format('0,0')
