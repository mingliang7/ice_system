findCustomer = (id) ->
	{name, customerType: type} = Ice.Collection.Customer.findOne(id)
	{name: name, customerType: type}

Template.ice_paymentGeneralMonitor.onRendered ->
	createNewAlertify(['searchBox', 'paymentPopUP'])

Template.ice_paymentGeneralMonitor.events
	'click .allInvoice': (e) ->
			alertify.searchBox(fa('', 'All General Payment'), renderTemplate(Template.allDocs))
    	.maximize()
Template.general_invoices.events 
	# 'change .paid': (event) ->
	# 	element = $(event.currentTarget)
	# 	id = element.parents('.order-info').find('.order-id').text()
	# 	value = element.prop('checked')
	# 	Meteor.call('updatePaid', id, value)
	"click .i-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ')
		GenReport(id[0])
	"click .p-print": (e) ->
		alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this))
Template.general_invoices.helpers
	invoices: ->
		today = moment(new Date()).format('YYYY-MM-DD')
		invoices = Ice.Collection.Order.find({closing: false}, {sort: {orderDate: -1 }}).fetch()
		$.each invoices, (index, invoice) ->
			invoice.index = index
		invoices
	type: (id) ->
		customerType = findCustomer(id).customerType
	customerName: (id) ->
		name = findCustomer(id).name
		" | Customer: #{name}"
	reportInfo: ( total, totalInDollar) ->
		total = numeral(total).format('0,0')
		totalInDollar = numeral(totalInDollar).format('0,0.000')
		"Total(R): #{total} | Total($): #{totalInDollar}"
		
	isEven: (index) ->
		index % 2 is 0
		
	format: (createdAt) ->
		moment(createdAt).format('hh:mm a')

	formatKH: (value) ->
		numeral(value).format('0,0')

# payment pop up 

# searching template  
Template.searchResult.helpers
	invoices: ->
		today = moment(new Date()).format('YYYY-MM-DD')
		invoices = Ice.Collection.Order.find({closing: false}, {sort: {orderDate: -1 }}).fetch()
		console.log(invoices)
		$.each invoices, (index, invoice) ->
			invoice.index = index
		invoices
	type: (id) ->
		customerType = findCustomer(id).customerType
	reportInfo: (id, total, totalInDollar) ->
		total = numeral(total).format('0,0')
		totalInDollar = numeral(totalInDollar).format('0,0.000')
		name = findCustomer(id).name
		"Customer: #{name}<br> Total(R): #{total}<br>Total($): #{totalInDollar}"
		
	isEven: (index) ->
		index % 2 is 0
		
	format: (createdAt) ->
		moment(createdAt).format('hh:mm a')

	formatKH: (value) ->
		numeral(value).format('0,0')

Template.searchResult.events 
	# 'change .paid': (event) ->
	# 	element = $(event.currentTarget)
	# 	id = element.parents('.order-info').find('.order-id').text()
	# 	value = element.prop('checked')
	# 	Meteor.call('updatePaid', id, value)
	"click .i-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ')
		GenReport(id[0])
	"click .p-print": (e) ->
		alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this))

Template.filteredPayment.events
	'change .filter': (e) ->
		value = $(e.currentTarget).val()
		instance = EasySearch.getComponentInstance {index: 'ice_orders'}
		EasySearch.changeProperty('ice_orders', 'filteredPayment', value)
		EasySearch.changeLimit('ice_orders', 10)
		instance.paginate(1)
		instance.triggerSearch()