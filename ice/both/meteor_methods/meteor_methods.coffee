Meteor.methods
	updatePaid: (id, cond) ->
		if cond is true
			Ice.Collection.OrderGroup.update({_id: id}, {$set:{paid: true}})
		else
			Ice.Collection.OrderGroup.update({_id: id}, {$set:{paid: false}})