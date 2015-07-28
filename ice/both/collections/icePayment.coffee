Ice.Collection.Payment = new Mongo.Collection('ice_payments')

Ice.Schema.Payment = new SimpleSchema(

	orderId_orderGroupId: 
		type: String
		label: 'invoiceId'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.invoice()
	customerId: 
		type: String
		label: 'Customer'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.customer()
	staffId: 
		type: String
		label: 'Staff'
		autoform:
			type: 'select2'
			options: ->
				Ice.List.paymentStaff()
	dueAmount:
		type: Number
		decimal: true
		label: 'Due Amount'
		
	paidAmount:
		type: Number
		decimal: true
		label: 'Paid Amount'

	outstandingAmount:
		type: Number
		decimal: true
		label: 'Outstanding Amount'
	
	paymentDate:
		type: String
		defaultValue: ->
			moment().format('YYYY-MM-DD HH:mm:ss')
	createdAt: 
		type: Date
		autoValue: ->
			if @isInsert
				new Date()



)

Ice.Collection.Payment.attachSchema Ice.Schema.Payment