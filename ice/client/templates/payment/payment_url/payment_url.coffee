
Template.ice_paymentUrlInsertTemplate.onRendered ->
	selectCustomer(this.data)

Template.ice_paymentUrlInsertTemplate.events
  'change [name="customerId"]': (e) ->
    customer = $(e.currentTarget).val()
    if customer != ''
      $('[name="orderId_orderGroupId"]').attr 'disabled', false
    else
      $('[name="orderId_orderGroupId"]').attr 'disabled', true
    Ice.ListForReportState.set 'customer', customer
  'change [name="orderId_orderGroupId"]': (e) ->
    currentInvoiceId = $(e.currentTarget).val()
    datePicker currentInvoiceId
    type = Ice.ListForReportState.get('type')
    if type == 'general'
      currentInvoice = Ice.Collection.Order.findOne(currentInvoiceId)
      Session.set 'oldPaidAmount', currentInvoice.paidAmount
      $('[name="dueAmount"]').val currentInvoice.outstandingAmount
      $('[name="paidAmount"]').val currentInvoice.outstandingAmount
      $('[name="outstandingAmount"]').val 0
    else
      currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId)
      Session.set 'oldPaidAmount', currentInvoice.paidAmount
      $('[name="dueAmount"]').val currentInvoice.outstandingAmount
      $('[name="paidAmount"]').val currentInvoice.outstandingAmount
      $('[name="outstandingAmount"]').val 0
  'keyup [name="paidAmount"]': ->
    dueAmount = parseInt($('[name="dueAmount"]').val())
    paidAmount = $('[name="paidAmount"]').val()
    if parseInt(paidAmount) > dueAmount
      $('[name="paidAmount"]').val dueAmount
      $('[name="outstandingAmount"]').val 0
    else if paidAmount == ''
      $('[name="outstandingAmount"]').val dueAmount
    else
      $('[name="outstandingAmount"]').val dueAmount - parseInt(paidAmount)
# date picker function
datePicker = (currentInvoiceId) ->
  maxDate = ''
  payments = Ice.Collection.Payment.find(orderId_orderGroupId: currentInvoiceId)
  if payments != undefined
    payments.forEach (payment) ->
      maxDate = if maxDate > payment.paymentDate then maxDate else payment.paymentDate
      return
    maxDate
  paymentDate = $('[name="paymentDate"]')
  if maxDate == '' then DateTimePicker.dateTime(paymentDate) else paymentDate.data('DateTimePicker').minDate(maxDate)


#function
selectCustomer = (self) ->
	Meteor.setTimeout -> 
		$('[name="customerId"]').select2('val', self.customerId)
		Ice.ListForReportState.set 'customer', self.customerId
		selectInvoice(self.id)
		fillInDetail(self.dueAmount, self.paidAmount, self.outstandingAmount)
		datePicker(self.id)
	100

selectInvoice = (invoiceId) ->
	Meteor.setTimeout ->
		$('[name="orderId_orderGroupId"]').select2('val', invoiceId)
	100

fillInDetail = (dueAmount, paidAmount, outstandingAmount) ->
	paidAmount = parseInt $('[name="paidAmount"]').val(outstandingAmount)
	dueAmount = parseInt $('[name="dueAmount"]').val(dueAmount)
	$('[name="outstandingAmount"]').val(0)
	Session.set 'oldPaidAmount', paidAmount

#Autoform hook
AutoForm.hooks
	ice_paymentUrlInsertTemplate:
		before:
			insert: (doc) ->
