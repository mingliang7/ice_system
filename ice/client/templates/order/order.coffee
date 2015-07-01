Template.ice_orderInsertTemplate.onRendered ->
  today = moment(new Date()).format('YYYY-MM-DD') 
  $('[name="orderDate"]').val(today)
  datePicker()
Template.ice_order.onRendered ->
  createNewAlertify('order')

Template.ice_order.events
  "click .insert": ->
    alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderInsertTemplate))
    .maximize()
    $('[name="total"]').attr('readonly', true)

  "click .print": ->
    GenReport(@_id) #generateReport alias function in order_autoform_hook

# insert form event
Template.ice_orderInsertTemplate.events 
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

  'click .print': ->
    Print.set 'print', true

  'change [name="exchange"]': (event) ->
    val = findExchange($(event.currentTarget).val())
    total = parseInt $('[name="total"]').val()
    if val.base is 'KHR'
      $('[name="totalInDollar"]').val(total * val.rates["USD"])




# functions
datePicker = ->
  orderDate = $('[name="orderDate"]')
  DateTimePicker.date orderDate

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
  currentQty = parseInt current.val()
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
  debugger
  if exchange is undefined
    totalInDollar.val('')
  else 
    if exchange.base is 'KHR'
      totalInDollar.val(total * exchange.rates["USD"])