Template.ice_orderInsertTemplate.onRendered ->
  datePicker()

Template.ice_order.onRendered ->
  createNewAlertify('order')

Template.ice_order.events
  "click .insert": ->
    alertify.order(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderInsertTemplate))
    .maximize()
    $('[name="total"]').attr('readonly', true)

Template.ice_orderInsertTemplate.events
  'change ': ->

datePicker = ->
  orderDate = $('[name="orderDate"]')
  DateTimePicker.date orderDate
