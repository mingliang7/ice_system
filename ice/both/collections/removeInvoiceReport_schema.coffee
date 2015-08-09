Ice.Schema.RemoveInvoiceReport = new SimpleSchema(
	user:
		type: String
		optional: true
		autoform: 
			type: 'select2'
			options: ->
				Ice.ListForReport.user()
	date:
		type: String
) 