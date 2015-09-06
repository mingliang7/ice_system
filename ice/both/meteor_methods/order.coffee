Meteor.methods
	orderId: (id) ->
		Ice.Collection.Order.findOne(id)

	orderGroupId: (id) ->
		Ice.Collection.OrderGroup.findOne(id)

	orderGroupIdWithData: (data, id) ->
		group = Ice.Collection.OrderGroup.findOne(id)
		{data: data, group: group}

	removeOrderAndOrderGroup: (data) ->
		data = data;
		id = data._id
		selector = undefined
		paidAmount = undefined
		if data.iceOrderGroupId != undefined
			paidAmount = Ice.Collection.OrderGroup.findOne({_id: data.iceOrderGroupId }).paidAmount
		else
			paidAmount = data.paidAmount
		if paidAmount == 0
			userId = Meteor.userId()
			userName = Meteor.users.findOne(userId).username;
			selector =
				dateTime: moment().format('YYYY-MM-DD HH:mm:ss')
				data: data
				removedBy:
					id: userId
					name: userName

		{id: id, paidAmount: paidAmount, selector: selector}
