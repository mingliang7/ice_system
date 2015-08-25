Meteor.methods({
	getOrderId: function(){
		return StateId.get('orderId')
	}
});