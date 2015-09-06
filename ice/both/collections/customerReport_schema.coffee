Ice.Schema.customerReport = new SimpleSchema(
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
		autoform:
			type: 'select2'
	date:
		label: 'Date'
		type: String
)
