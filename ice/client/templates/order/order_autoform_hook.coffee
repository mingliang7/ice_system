@Print = new ReactiveObj();
generateReport = (id) ->
	doc = Ice.Collection.Order.findOne(id)
	url = "invoiceReportGen?orderId=#{id}&customerId=#{doc.iceCustomerId}&date=#{moment(doc.createdAt).format('YYYY-MM-DD hh:mm:ss a')}"
	window.open(url, '_blank')
@GenReport = generateReport

sumDate = (orderStarted, type) ->
	orderStarted.setDate(orderStarted.getDate() + parseInt type) 
	endDate = moment(orderStarted).format('YYYY-MM-DD')
	endDate

setOrderGroup = (doc) ->
	orderGroup = new OrderGroup(doc) #instantiate from OrderGroup class inside classes folder
	{customerType: type} = OneRecord.customer(doc.iceCustomerId) #calling from OneRecord in query methods file
	if type isnt 'general'
		startDate = moment(new Date(doc.orderDate)).format('YYYY-MM-DD')
		endDate = sumDate(new Date(doc.orderDate), type)
		group =  OneRecord.findOrderGroupActiveDate(doc.iceCustomerId, startDate, endDate ) #calling from OneRecord in query methods file
		if group is undefined || group is null
			prefix = "#{Session.get('currentBranch')}-"
			id = idGenerator.genWithPrefix(Ice.Collection.OrderGroup, prefix, 12)
			orderGroup.whenNoActiveDate(id, startDate, endDate)
		else
			orderGroup.whenActiveDate(group, startDate, endDate)
	
AutoForm.hooks
	ice_orderInsertTemplate:
		before: 
			insert: (doc) ->
				doc.createdAt = new Date()
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12)
				doc.cpanel_branchId = Session.get('currentBranch')
				doc.createdAt = new Date()
				if (doc.orderDate and doc.iceCustomerId and doc.iceOrderDetail) isnt undefined
					setOrderGroup(doc)
				doc

		after:
			insert: (err, id) ->
				if err
					Print.set 'print', false
				else
					print = Print.get 'print'
					if print is true
						generateReport(id)
						Print.set 'print', false

		onSuccess: (formType, result) ->
			alertify.order().close()
			alertify.success 'Successfully'

		onError: (formType, error) ->
			alertify.error error.message

