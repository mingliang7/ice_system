Meteor.methods
	orderId: (id) ->
		Ice.Collection.Order.findOne(id)