class @OrderGroup
	constructor: (doc) ->
		@doc = doc
	whenNoActiveDate: (id, startDate, endDate) =>
		doc = @doc
		groupBy = {}
		discount = 0
		if doc.discount isnt undefined
			discount = doc.discount

		groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]=
			items:
				findItem(doc)
			discount: if doc.discount is undefined then 0 else doc.discount
			total: doc.total
			totalInDollar: doc.totalInDollar
		orderGroupId = Ice.Collection.OrderGroup.insert({
			_id: id
			startDate: startDate
			endDate: endDate
			dueAmount: doc.total
			paidAmount: 0
			outstandingAmount: doc.total
			discount: discount
			total: doc.total
			totalInDollar: doc.totalInDollar
			iceCustomerId: doc.iceCustomerId
			groupBy: groupBy
			createdAt: new Date()
			updatedAt: new Date()
		})
		Ice.Collection.Order.direct.update({_id: doc._id}, {$set: {iceOrderGroupId: orderGroupId}})
	whenActiveDate: (orderGroup) =>
		doc = @doc
		dueAmount = 0
		total = 0
		totalInDollar = 0
		totalDiscount = 0
		discount = 0
		groupBy = orderGroup.groupBy

		if _.has(groupBy, "day#{moment(doc.orderDate).format('YYYY-MM-DD')}")
			doc.iceOrderDetail.forEach (item) ->
				if item.discount isnt undefined
					discount = item.discount
				{name: name, price: price} = findItemName(item.iceItemId)
				itemObj = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['items']["#{item.iceItemId}"]
				itemObj['price'] = item.price
				itemObj['qty'] += item.qty
				itemObj['discount'] += discount
				itemObj['amount'] += item.amount
		else
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"] =
				items:
					findItem(doc)
				discount: 0
				total: 0
				totalInDollar: 0
		if _.has(groupBy, "day#{moment(doc.orderDate).format('YYYY-MM-DD')}")
			discountDoc = 0
			if doc.discount != undefined
				discountDoc = doc.discount
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['total'] = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['total'] + doc.total
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['totalInDollar'] = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['totalInDollar'] + doc.totalInDollar
			groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['discount'] = groupBy["day#{moment(doc.orderDate).format('YYYY-MM-DD')}"]['discount'] + discountDoc

		for i of groupBy
			dueAmount += groupBy[i]['total']
			totalDiscount += groupBy[i]['discount']
			total += groupBy[i]['total']
			totalInDollar += groupBy[i]['totalInDollar']
		Ice.Collection.OrderGroup.update({_id: orderGroup._id},{$set:{dueAmount: dueAmount, outstandingAmount: dueAmount, total: total, totalInDollar: totalInDollar, discount: totalDiscount, updatedAt: new Date(), groupBy: groupBy}})
		Ice.Collection.Order.direct.update({_id: doc._id}, {$set: {iceOrderGroupId: orderGroup._id}})
	#functions
	findItemName = (itemId, qty=0 , amount = 0) ->
		{name, price} = OneRecord.item(itemId)
		{name: name, price: price, qty: qty, amount: amount }

	findItem = (doc) ->
		items = {}
		discount = 0
		allItems = Ice.Collection.Item.find()
		allItems.forEach (item) ->
			items[item._id] = {name: item.name, price: item.price, qty: 0, amount: 0, discount: 0}
		doc.iceOrderDetail.forEach (item) ->
			if item.discount != undefined
				discount = item.discount
			items[item.iceItemId] =
				name: items[item.iceItemId]['name']
				price: item.price
				qty: items[item.iceItemId]['qty'] += item.qty
				amount: items[item.iceItemId]['amount'] += item.amount
				discount: discount
		items
