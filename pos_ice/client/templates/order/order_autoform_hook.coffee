sumDate = (orderStarted, type) ->
	orderStarted.setDate(orderStarted.getDate() + parseInt type) 
	orderStarted

setOrderGroup = (doc) ->
	doc.iceOrderGroupId = {}
	{customerType: type} = Record.customer(doc.iceCustomerId) #calling from tabular iceOrder
	doc.iceOrderGroupId.orderStarted = new Date() 
	doc.iceOrderGroupId.type = type
	if type isnt 'general'
		doc.iceOrderGroupId.orderFinished =  sumDate(new Date(), type)
	doc

AutoForm.hooks
	ice_orderInsertTemplate:
		before: 
			insert: (doc) ->
				doc.createdAt = new Date()
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
				doc.cpanel_branchId = Session.get('currentBranch')
				doc.createdAt = new Date()
				setOrderGroup(doc)
				

		onSuccess: (formType, result) ->
			alertify.success 'Successfully'

		onError: (formType, error) ->
			alertify.error error.message