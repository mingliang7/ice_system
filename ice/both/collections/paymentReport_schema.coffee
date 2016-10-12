Ice.Schema.paymentReport = new SimpleSchema(
	staffId:
		type: String
		label: 'Staff'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.staff()
	customerType:
		type: String
		label: 'Customer Type'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.customerType()
	customerId:
		type:String
		label: 'Customer'
		optional: true
	date:
		label: 'Date'
		type: String

	exchange:
		type: String
		label: 'Exchange'
		autoform:
			type: 'select2'
			options: ->
				Ice.List.exchange()
	includeGroup:
		type: Boolean
		label: 'Include Group'
		optional: true
)
