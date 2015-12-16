Ice.Schema.LendingBalance = new SimpleSchema(
	staffId:
		type: String
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.staff()
	type:
		type: String
		optional: true
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.lendingType()
	date:
		type: String
		defaultValue: ->
			moment().format('YYYY-MM-DD')
)
