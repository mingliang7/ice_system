Session.setDefault 'customer', ''
Template.ice_payment.helpers
	foo: ->
		if @ isnt null
			self = @
			Session.set customer, findCustomer(self.customerId)
		Session.get 'customer'
			
Template.ice_payment.events
	'change [name="customerId"]': (e) ->
		customer = $(e.currentTarget).val()
		if customer isnt ''
			$('[name="orderId_orderGroupId"]').attr('disabled', false) 
		else
			$('[name="orderId_orderGroupId"]').attr('disabled', true)
		Ice.ListForReportState.set 'customer', customer
	'change [name="orderId_orderGroupId"]': (e) ->
		currentInvoiceId = $(e.currentTarget).val()
		type = Ice.ListForReportState.get('type')
		if type is 'general'
			currentInvoice = Ice.Collection.Order.findOne(currentInvoiceId)
			Session.set 'oldPaidAmount', currentInvoice.paidAmount
			$('[name="dueAmount"]').val(currentInvoice.outstandingAmount)
			$('[name="paidAmount"]').val(currentInvoice.outstandingAmount)
			$('[name="outstandingAmount"]').val(0)
		else
			currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId)
			Session.set 'oldPaidAmount', currentInvoice.paidAmount
			$('[name="dueAmount"]').val(currentInvoice.outstandingAmount)
			$('[name="paidAmount"]').val(currentInvoice.outstandingAmount)
			$('[name="outstandingAmount"]').val(0)
	'keyup [name="paidAmount"]': ->
		dueAmount = parseInt $('[name="dueAmount"]').val()
		paidAmount = $('[name="paidAmount"]').val()
		if parseInt(paidAmount) > dueAmount
			$('[name="paidAmount"]').val(dueAmount)
			$('[name="outstandingAmount"]').val(0)
		else if paidAmount is ''
			$('[name="outstandingAmount"]').val(dueAmount)
		else
			$('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount))
# function
findCustomer = (id) ->
	{name} = Ice.Collection.Customer.findOne(id)
	name
