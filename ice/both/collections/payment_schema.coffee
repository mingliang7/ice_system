Ice.Schema.Payment = new SimpleSchema(
	invoiceId:
		type: String
		label: 'Invoice'
		autoform: 
			type: 'select2'
			options: ->
				Ice.ListForReport.invoice
	customerId: 
		type: String
		label: 'Customer'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.customer
	staffId: 
		type: String
		label: 'Staff'
		autoform:
			type: 'select2'
			options: ->
				''
	dueAmount: 
		type: Number
		decimal: true
		label: 'Due Amount'
	
	paidAmount:
		type: Number
		decimal: true
		label: 'Paid Amount'
	
	balance: 
		type: Number
		decimal: true
		label: 'Balance'

)