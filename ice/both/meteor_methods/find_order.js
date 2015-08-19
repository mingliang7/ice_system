Meteor.methods({
	findOrderWhichHasNoGroupId: function(){
		var customers = Ice.Collection.Customer.find({customerType: {$ne: 'general'}}).fetch();
		var orders = undefined;
		var orderGroup = undefined;
		customers.forEach(function(customer) {
			orders = Ice.Collection.Order.find({iceCustomerId: customer._id}).fetch()
			if(orders.length > 0){
				orders.forEach(function(order) {
					var orderGroup = Ice.Collection.OrderGroup.findOne({_id: order.iceOrderGroupId})
					console.log(orderGroup + ' ' + order._id);
					if(_.isUndefined(orderGroup)){
						getOrderGroupId(order, customer._id);
					}
				});
			}
		});
	},
	findOrderWhichIsNameDifferenctFromGroup: function (){
		var customers = Ice.Collection.Customer.find({customerType: {$ne: 'general'}}).fetch();
		var orders = undefined;
		var orderGroup = undefined;
		customers.forEach(function(customer) {
			orders = Ice.Collection.Order.find({iceCustomerId: customer._id}).fetch()
			if(orders.length > 0){
				orders.forEach(function(order) {
					var orderGroup = Ice.Collection.OrderGroup.findOne({_id: order.iceOrderGroupId})
					if(!_.isUndefined(orderGroup)){
						if(order._customer.name != orderGroup._customer.name){
							Ice.Collection.Order.direct.update(order._id, 
								{$set: {_customer: orderGroup._customer}})
							console.log('updated' + ' order._id');
						}
					}
				});
			}
		});
	}
});

var getOrderGroupId = function(order, customerId){
	var orderDate = order.orderDate.split(' ');
	var orderGroups = Ice.Collection.OrderGroup.find({iceCustomerId: customerId}); 
	var groupByDay = 'day' + orderDate[0];
	console.log(groupByDay);
	orderGroups.forEach(function(orderGroup) {
		if(!_.isUndefined(orderGroup.groupBy[groupByDay])){
			Ice.Collection.Order.direct.update(order._id, {$set: {iceOrderGroupId: orderGroup._id}})
			console.log('updated ' + order._id);
		}else{
			if(orderDate[0] >= orderGroup.startDate && orderDate[0] <= orderGroup.endDate ){
				var newObj = orderGroup;
				var dueAmount = 0,
					totalDiscount = 0,
					total = 0, 
					totalInDollar = 0 ;

				newObj.groupBy[groupByDay]= {
					items: findItem(order),
			    	discount: order.discount == undefined ? 0 : order.discount,
			    	total: order.total,
			    	totalInDollar: order.totalInDollar
				}
				for (var i in newObj.groupBy) {
 				 dueAmount += newObj.groupBy[i]['total'];
  		 		 totalDiscount += newObj.groupBy[i]['discount'];
  				 total += newObj.groupBy[i]['total'];
  				 totalInDollar += newObj.groupBy[i]['totalInDollar'];
				}
				Ice.Collection.OrderGroup.update({_id: orderGroup._id},{$set:{dueAmount: dueAmount, outstandingAmount: dueAmount, total: total, totalInDollar: totalInDollar, discount: totalDiscount, updatedAt: new Date(), groupBy: newObj.groupBy}})
				Ice.Collection.Order.direct.update({_id: order._id}, {$set: {iceOrderGroupId: orderGroup._id}})	 
				console.log('updated group' + orderGroup._id );
			}
		}
	});
}



var findItem = function(doc) {
  var allItems, discount, items;
  items = {};
  discount = 0;
  allItems = Ice.Collection.Item.find();
  allItems.forEach(function(item) {
    items[item._id] = {
      name: item.name,
      price: item.price,
      qty: 0,
      amount: 0,
      discount: 0
    };
  });
  doc.iceOrderDetail.forEach(function(item) {
    if (item.discount !== void 0) {
      discount = item.discount;
    }
    items[item.iceItemId] = {
      name: items[item.iceItemId]['name'],
      price: item.price,
      qty: items[item.iceItemId]['qty'] += item.qty,
      amount: items[item.iceItemId]['amount'] += item.amount,
      discount: discount
    };
  });
  return items;
};
