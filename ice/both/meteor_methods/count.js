Meteor.methods({
	generalCount: function(){
		order = Ice.Collection.Order.find({closing: false}).fetch();
		return order.length;
	},
	groupCount: function(){
		orderGroup = Ice.Collection.OrderGroup.find({closing: false}).fetch();
		return orderGroup.length;	
	},
	totalCount: function(){
		order = Ice.Collection.Order.find({closing: false}).fetch();
		orderGroup = Ice.Collection.OrderGroup.find({closing: false}).fetch();
		return order.length + orderGroup.length;
	}
});