Ice.Schema.UnpaidGeneral = new SimpleSchema(
	date:
		type: String
		defaultValue: ->
			moment().format('YYYY-MM-DD')
)