sumDate = (orderStarted, type) ->
	orderStarted.setDate(orderStarted.getDate() + parseInt type) 
	endDate = moment(orderStarted).format('YYYY-MM-DD')
	endDate

setOrderGroup = (doc) ->
	orderGroup = new OrderGroup(doc) #instantiate from OrderGroup class inside classes folder
	{customerType: type} = OneRecord.customer(doc.iceCustomerId) #calling from OneRecord in query methods file
	if type isnt 'general'
		startDate = moment(doc.createdAt).format('YYYY-MM-DD')
		endDate = sumDate(doc.createdAt, type)
		group =  OneRecord.findOrderGroupActiveDate(doc.iceCustomerId, startDate, endDate ) #calling from OneRecord in query methods file
		if group is undefined 
			prefix = "#{Session.get('currentBranch')}-"
			id = idGenerator.genWithPrefix(Ice.Collection.OrderGroup, prefix, 12)
			orderGroup.whenNoActiveDate(id, startDate, endDate)
	
AutoForm.hooks
	ice_orderInsertTemplate:
		before: 
			insert: (doc) ->
				doc.createdAt = new Date()
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12)
				doc.cpanel_branchId = Session.get('currentBranch')
				doc.createdAt = new Date()
				setOrderGroup(doc)
				

		onSuccess: (formType, result) ->
			alertify.success 'Successfully'

		onError: (formType, error) ->
			alertify.error error.message