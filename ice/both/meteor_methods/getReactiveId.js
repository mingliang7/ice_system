Meteor.methods({
	getOrderId: function(id){
		return StateId.get('' + id)
	}
});