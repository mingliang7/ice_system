findItem = (doc) -> 
	items = {}
	doc.iceOrderDetail.forEach (item) ->
		items = findItemName(item.iceItemId, item.qty, item.amount)
	items

findItemName = (itemId, qty, amount) ->
	{name, price} = OneRecord.item(itemId)
	"Name: #{name}, Price: #{price}, Qty: #{qty}, Amount: #{amount}"

sumDate = (orderStarted, type) ->
	orderStarted.setDate(orderStarted.getDate() + parseInt type) 
	endDate = moment(orderStarted).format('YYYY-MM-DD')
	endDate

setOrderGroup = (doc) ->
	{customerType: type} = OneRecord.customer(doc.iceCustomerId) #calling from OneRecord in query methods file
	if type isnt 'general'
		startDate = moment(doc.createdAt).format('YYYY-MM-DD')
		endDate = sumDate(doc.createdAt, type)
		group =  OneRecord.findOrderGroupActiveDate(doc.iceCustomerId, startDate, endDate ) #calling from OneRecord in query methods file
		if group is undefined 
			groupBy = {}
			groupBy["day#{startDate}"]=
				item: findItem(doc)
				Total: doc.total
			orderGroupId = Ice.Collection.OrderGroup.insert({
				_id: idGenerator.genWithPrefix(Ice.Collection.OrderGroup, "#{Session.get('currentBranch')}-", 12)
				startDate: startDate
				endDate: endDate
				total: doc.total
				iceCustomerId: doc.iceCustomerId
				groupBy: groupBy
				createdAt: new Date()
				updatedAt: new Date()   
			})
	doc.iceOrderGroupId = orderGroupId		
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