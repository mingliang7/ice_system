Meteor.methods({
	removePaymentWhichHasNoOrder: function(){
		var payments = Ice.Collection.Payment.find().fetch()
		payments.forEach(function(payment) {
			var order = Ice.Collection.Order.findOne(payment.orderId_orderGroupId);
			if(order == undefined){
				Ice.Collection.Payment.remove(payment._id);
			}
		});
	}
});
