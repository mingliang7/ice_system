Ice.Schema.UnpaidGeneral = new SimpleSchema(
	staff:
		type: String
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.staff()
	date:
		type: String
		defaultValue: ->
			moment().format('YYYY-MM-DD')
)