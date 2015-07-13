class @OrderGroup
	constructor: (doc) ->
		@doc = doc
	whenNoActiveDate: (id, startDate, endDate) =>
		doc = @doc
		groupBy = {}
		groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]=
			items:
				findItem(doc)
			total: doc.total
			totalInDollar: doc.totalInDollar
		orderGroupId = Ice.Collection.OrderGroup.insert({
			_id: id
			startDate: startDate
			endDate: endDate
			dueAmount: doc.total
			paidAmount: 0
			outstandingAmount: doc.total
			total: doc.total
			totalInDollar: doc.totalInDollar
			iceCustomerId: doc.iceCustomerId
			groupBy: groupBy
			createdAt: new Date()
			updatedAt: new Date()   
		})
		doc.iceOrderGroupId = orderGroupId		
	whenActiveDate: (orderGroup) =>
		doc = @doc
		dueAmount = 0
		total = 0
		totalInDollar = 0
		groupBy = orderGroup.groupBy

		if _.has(groupBy, "day#{moment(doc.orderDate).format('YYYY-MM-DD')}")
			doc.iceOrderDetail.forEach (item) ->
				{name: name, price: price} = findItemName(item.iceItemId)
				itemObj = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['items']["#{item.iceItemId}"]
				itemObj['price'] = item.price  
				itemObj['qty'] += item.qty  
				itemObj['amount'] += item.amount
		else
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"] = 
				items:
					findItem(doc)
				total: 0
				totalInDollar: 0		
		if _.has(groupBy, "day#{moment(doc.orderDate).format('YYYY-MM-DD')}")
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['total'] = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['total'] + doc.total		
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['totalInDollar'] = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['totalInDollar'] + doc.totalInDollar

		for i of groupBy
			dueAmount += groupBy[i]['total']
			total += groupBy[i]['total']
			totalInDollar += groupBy[i]['totalInDollar']
		Ice.Collection.OrderGroup.update({_id: orderGroup._id},{$set:{dueAmount: dueAmount, outstandingAmount: dueAmount, total: total, totalInDollar: totalInDollar, updatedAt: new Date(), groupBy: groupBy}})
		doc.iceOrderGroupId = orderGroup._id 
	#functions	
	findItemName = (itemId, qty=0 , amount = 0) ->
		{name, price} = OneRecord.item(itemId)
		{name: name, price: price, qty: qty, amount: amount }
		
	findItem = (doc) ->
		items = {}

		allItems = Ice.Collection.Item.find()
		allItems.forEach (item) ->
			items[item._id] = {name: item.name, price: item.price, qty: 0, amount: 0} 
		doc.iceOrderDetail.forEach (item) ->
			items[item.iceItemId] = 
				name: items[item.iceItemId]['name']
				price: item.price
				qty: items[item.iceItemId]['qty'] += item.qty
				amount: items[item.iceItemId]['amount'] += item.amount
		items
		
