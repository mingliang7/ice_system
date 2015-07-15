findCustomer = (id) ->
	{name, customerType: type} = Ice.Collection.Customer.findOne(id)
	{name: name, customerType: type}

Template.list_invoices.events 
	# 'change .paid': (event) ->
	# 	element = $(event.currentTarget)
	# 	id = element.parents('.order-info').find('.order-id').text()
	# 	value = element.prop('checked')
	# 	Meteor.call('updatePaid', id, value)
	"click .i-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text()
		doc = Ice.Collection.OrderGroup.findOne(id)
		url = "invoiceGroupReportGen?id=#{id}&customerId=#{doc.iceCustomerId}&date=#{moment(doc.startDate).format('YYYY-MM-DD hh:mm:ss a')}&endDate=#{moment(doc.endDate).format('YYYY-MM-DD hh:mm:ss a')}"
		window.open(url, '_blank')
	"click .p-print": (e) ->
		id = $(e.currentTarget).parents('.order-info').find('.order-id').text()
		doc = Ice.Collection.OrderGroup.findOne(id)
		url = "payment_url?id=#{id}&customerId=#{doc.iceCustomerId}&paidAmount=#{doc.paidAmount}&outstandingAmount=#{doc.outstandingAmount}&dueAmount=#{doc.outstandingAmount}"
		window.open(url)
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

#	progress: (id) ->
#		#unCooked = Restuarant.Collection.Invoice.find({_id: id, 'product.cooked': false}).count()
#		cooked = Restuarant.Collection.Invoice.findOne({_id: id})
#		total_cooked = 0
#		if cooked isnt undefined
#			cooked.product.forEach (product) ->
#				if product.cooked is true
#					total_cooked += 1
#		total = cooked.product.length
#		(total_cooked * 100)/total

#Template.list_invoices.events
#	'change .check': (event) ->
#		element = $(event.currentTarget)
#		id = element.parents('p.invoiceId').find('.id').val()
#		value = element.prop('checked')
#
#		if value is yes
#			Meteor.call 'setCooked', id, @name
#		else
#			Meteor.call 'unsetCooked', id, @name
#
#	'change .done': (event) ->
#		current = @invoiceId
#		element = $(event.currentTarget)
#		value = element.prop('checked')
#
#		if value is yes
#			Meteor.call 'setAllCooked', @_id
#		else
#			Meteor.call 'unSetAllCooked', @_id
