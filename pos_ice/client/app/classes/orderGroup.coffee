class @OrderGroup
	constructor: (doc) ->
		@doc = doc
	whenNoActiveDate: (id, startDate, endDate) =>
		doc = @doc
		groupBy = {}
		groupBy["day#{startDate}"]=
			item:
				findItem(doc)
			Total: doc.total
		orderGroupId = Ice.Collection.OrderGroup.insert({
			_id: id
			startDate: startDate
			endDate: endDate
			total: doc.total
			iceCustomerId: doc.iceCustomerId
			groupBy: groupBy
			createdAt: new Date()
			updatedAt: new Date()   
		})
		doc.iceOrderGroupId = orderGroupId		
	whenActiveDate: (group, startDate, endDate) =>
		doc = @doc
		# Ice.Collection.OrderGroup.update({
		# 	_id: group._id
		# }, {$set: {groupBy: }})

	findItemName = (itemId, qty=0 , amount = 0) ->
		
		{name, price} = OneRecord.item(itemId)
		{Name: name, Price: price, Qty: qty, Amount: amount }
		

	findItem = (doc) ->
		items = {}
		doc.iceOrderDetail.forEach (item) ->
			items[item.iceItemId] = findItemName(item.iceItemId, item.qty, item.amount)
		items
		
	newItemName: (iceItemId) ->
		item = {}
		item[iceItemId] = 
			qty: 0 
			amount: 0

