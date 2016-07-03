Ice.Collection.EndOfProcess.after.insert(function (userId, doc){
	var date = moment(doc.date).format('YYYY-MM-DD 00:00:00');
	Meteor.defer(function(){
		Meteor._sleepForMs(200);
		var payment = 0 ;
		var removeOrder = 0 ;
		var removeOrderGroup = 0 ;
		var orders = Ice.Collection.Order.find({outstandingAmount: 0, orderDate: {$lt: date}}).fetch();
		var orderGroups = Ice.Collection.OrderGroup.find({
			outstandingAmount: 0 , endDate: {$lt: doc.date}
		}).fetch();
		orderGroups.forEach(function(group) {
			for(var k in group._payment){
				payment += 1 ;
				Ice.Collection.Payment.remove(k);
				console.log('Remove Payment #' + k);
			}
			removeOrderGroup += 1 ;
			Ice.Collection.Order.remove({iceOrderGroupId: group._id})
			Ice.Collection.OrderGroup.remove(group._id);
			console.log('Remove OrderGroup #' + group._id);
		});
		orders.forEach(function(order) {
			for(var k in order._payment){
				payment += 1 ;
				Ice.Collection.Payment.remove(k);
				console.log('Remove Payment #' + k);
			}
			removeOrder += 1 ;
			Ice.Collection.Order.remove(order._id);
			console.log('Remove Order #' + order._id);
		});
		console.log('Successfully remove ' + removeOrderGroup + ' order groups | '
			+ removeOrder + ' orders and | ' + payment + ' payments');
	});
});
