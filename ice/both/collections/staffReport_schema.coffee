Ice.Schema.StaffReport = new SimpleSchema(
	staffId:
		type: String
		label: 'Staff'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.staff()
	customerType: 
		type: String
		label: 'Customer Type'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.customerType()
	customerId:
		type:String
		label: 'Customer'
		autoform:
			type: 'select2'
			options: ->
				Ice.ListForReport.orderInvoice()
	date:
		label: 'Date'
		type: String

	exchange: 
		type: String
		label: 'Exchange'
		autoform:
			type: 'select2'
			options: ->
				''
)