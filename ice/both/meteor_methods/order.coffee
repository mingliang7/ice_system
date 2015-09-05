Meteor.methods
	orderId: (id) ->
		Ice.Collection.Order.findOne(id)

	orderGroupId: (id) ->
		Ice.Collection.OrderGroup.findOne(id)