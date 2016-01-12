Ice.Collection.Payment = new Mongo.Collection('ice_payments')

Ice.Schema.Payment = new SimpleSchema(
	orderId_orderGroupId:
		type: String
		label: 'invoiceId'
		autoform:
			type: 'select'

	customerId:
		type: String
		label: 'Customer'

	staffId:
		type: String
		label: 'Staff'
		autoform:
			type: 'select2'
			options: ->
				Ice.List.staff()
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
	createdAt:
		type: Date
		autoValue: ->
			if @isInsert
				new Date()



)

Ice.Collection.Payment.attachSchema Ice.Schema.Payment
