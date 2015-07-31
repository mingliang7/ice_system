Ice.Schema.RemoveInvoiceReport = new SimpleSchema(
	date:
		type: String
		defaultValue: ->
			moment().format('YYYY-MM-DD HH:mm:ss')
) 