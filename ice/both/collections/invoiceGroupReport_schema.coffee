Ice.Schema.invoiceGroup = new SimpleSchema(
	status: 
		type: String
		label: 'Status'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.status()
	customerType: 
		type: String
		label: 'Customer Type'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.groupCustomerType()

	customerId:
		type:String
		label: 'Customer'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.customerByType()

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
)