Meteor.methods
	orderId: (id) ->
		Ice.Collection.Order.findOne(id)

	orderGroupId: (id) ->
		Ice.Collection.OrderGroup.findOne(id)

	orderGroupIdWithData: (data, id) ->
		group = Ice.Collection.OrderGroup.findOne(id)
		{data: data, group: group}
