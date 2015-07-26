findCustomer = (id) ->
	{name, customerType: type} = Ice.Collection.Customer.findOne(id)
	{name: name, customerType: type}
Template.ice_paymentGroupMonitor.onRendered ->
	createNewAlertify(['groupSearch', 'paymentPopUP'])
	
Template.ice_paymentGroupMonitor.events
	'click .allGroupInvoice': (e) ->
			alertify.groupSearch(fa('', 'All Group Payment'), renderTemplate(Template.allGroupDocs))
    	.maximize()
Template.list_invoices.events 
	# 'change .paid': (event) ->
	# 	element = $(event.currentTarget)
	# 	id = element.parents('.order-info').find('.order-id').text()
	# 	value = element.prop('checked')
	# 	Meteor.call('updatePaid', id, value)
	"click .i-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ')
		doc = Ice.Collection.OrderGroup.findOne(id[0])
		url = "invoiceGroupReportGen?id=#{id[0]}&customerId=#{doc.iceCustomerId}&date=#{moment(doc.startDate).format('YYYY-MM-DD hh:mm:ss a')}&endDate=#{moment(doc.endDate).format('YYYY-MM-DD hh:mm:ss a')}"
		window.open(url, '_blank')
	"click .p-print": (e) ->
		alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this))
Template.list_invoices.helpers
	invoices: ->
		date = new Date().getDate() - 1 
		today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD')
		invoices = Ice.Collection.OrderGroup.find({endDate: today}).fetch()
		console.log(invoices)
		$.each invoices, (index, invoice) ->
			invoice.index = index
		invoices
	type: (id) ->
		customerType = findCustomer(id).customerType
		"#{customerType} Days"
	customerName: (id) ->
		name = findCustomer(id).name
		" | Customer: #{name}"
	reportInfo: (total, totalInDollar) ->
		total = numeral(total).format('0,0.000')
		totalInDollar = numeral(totalInDollar).format('0,0.000')
		
		"Total(R): #{total} | Total($): #{totalInDollar}"
		
	isEven: (index) ->
		index % 2 is 0
		
	format: (createdAt) ->
		moment(createdAt).format('hh:mm a')

	formatKH: (value) ->
		numeral(value).format('0,0')

# searching template
Template.searchGroupResult.helpers
	invoices: ->
		date = new Date().getDate() - 1 
		today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD')
		invoices = Ice.Collection.OrderGroup.find({endDate: today}).fetch()
		console.log(invoices)
		$.each invoices, (index, invoice) ->
			invoice.index = index
		invoices
	type: (id) ->
		customerType = findCustomer(id).customerType
		"#{customerType} Days"
	reportInfo: (id, total, totalInDollar) ->
		total = numeral(total).format('0,0.000')
		totalInDollar = numeral(totalInDollar).format('0,0.000')
		name = findCustomer(id).name
		"Customer: #{name}<br> Total(R): #{total}<br>Total($): #{totalInDollar}"
		
	isEven: (index) ->
		index % 2 is 0
		
	format: (createdAt) ->
		moment(createdAt).format('hh:mm a')

	formatKH: (value) ->
		numeral(value).format('0,0')

Template.searchGroupResult.events 
	"click .i-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ')
		doc = Ice.Collection.OrderGroup.findOne(id[0])
		url = "invoiceGroupReportGen?id=#{id[0]}&customerId=#{doc.iceCustomerId}&date=#{moment(doc.startDate).format('YYYY-MM-DD hh:mm:ss a')}&endDate=#{moment(doc.endDate).format('YYYY-MM-DD hh:mm:ss a')}"
		window.open(url, '_blank')
	"click .p-print": (e) ->
		alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this))

Template.filteredGroupPayment.events
	'change .filter-group': (e) ->
		value = $(e.currentTarget).val()
		instance = EasySearch.getComponentInstance {index: 'ice_orderGroups'}
		EasySearch.changeProperty('ice_orderGroups', 'filteredGroupPayment', value)
		EasySearch.changeLimit('ice_orderGroups', 10)
		instance.paginate(1)
		instance.triggerSearch()