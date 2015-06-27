class @OrderGroup
	constructor: (doc) ->
		@doc = doc
	whenNoActiveDate: (id, startDate, endDate) =>
		doc = @doc
		groupBy = {}
		groupBy["day#{startDate}"]=
			items:
				findItem(doc)
			total: doc.total
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
	whenActiveDate: (orderGroup, startDate, endDate) =>
		doc = @doc
		total = 0
		groupBy = orderGroup.groupBy

		if _.has(groupBy, "day#{startDate}")
			doc.iceOrderDetail.forEach (item) ->
				{name: name, price: price} = findItemName(item.iceItemId)
				itemObj = groupBy["day#{startDate}"]['items']["#{item.iceItemId}"]
				itemObj['price'] = item.price  
				itemObj['qty'] += item.qty  
				itemObj['amount'] += item.amount
		else
			groupBy["day#{startDate}"] = 
				items:
					findItem(doc)
				total: 0		
		groupBy

		if _.has(groupBy, "day#{startDate}")
			groupBy["day#{startDate}"]['total'] = groupBy["day#{startDate}"]['total'] + doc.total		
		groupBy
		debugger
		# Ice.Collection.OrderGroup.update({_id: orderGroup._id},{$set:{total: orderGroupTotal, updatedAt: new Date(), groupBy: groupBy}})

	#functions	
	findItemName = (itemId, qty=0 , amount = 0) ->
		{name, price} = OneRecord.item(itemId)
		{name: name, price: price, qty: qty, amount: amount }
		
	findItem = (doc) ->
		items = {}
		price = 0
		allItems = Ice.Collection.Item.find()
		allItems.forEach (item) ->
			items[item._id] = {name: item.name, price: item.price, qty: 0, amount: 0} 
		doc.iceOrderDetail.forEach (item) ->
			if items[item.iceItemId]['price'] is item.price
				updatedPrice = items[item.iceItemId]['price']
			else
				updatedPrice = item.price

			items[item.iceItemId] = 
				name: items[item.iceItemId]['name']
				price: price
				qty: items[item.iceItemId]['qty'] += item.qty
				amount: items[item.iceItemId]['amount'] += item.amount
		items
		
