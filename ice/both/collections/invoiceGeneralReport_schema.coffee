Ice.Schema.InvoiceGeneral  = new SimpleSchema(
	customer:
		type:String
		label: 'Customer'
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.generalCustomer()
	date:
		label: 'Date'
		type: String
)