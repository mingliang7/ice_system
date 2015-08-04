Meteor.methods
	updatePaid: (id, cond) ->
		if cond is true
			Ice.Collection.OrderGroup.update({_id: id}, {$set:{paid: true}})
		else
			Ice.Collection.OrderGroup.update({_id: id}, {$set:{paid: false}})

	migrateOrder: ->
		countPayment = 0 
		countOrder = 0 
		orders = Ice.Collection.Order.find()
		orders.forEach (order) ->
			if order.paidAmount != 0
				countOrder += 1 
				payment = {} 
				payments = Ice.Collection.Payment.find(orderId_orderGroupId: order._id, {sort: {paymentDate: 1}})
				payments.forEach (obj) ->
					countPayment += 1
					payment[obj._id] =
						customerId: obj.customerId
						staff: obj.staffId
						date: obj.paymentDate
						dueAmount: obj.dueAmount
						paidAmount: obj.paidAmount
						outstandingAmount: obj.outstandingAmount
				if order.closing
					obj = _.findLastKey(payment, (payment) -> 
									payment
								)
					try
						closingDate = payment[obj].date
					catch e
						console.log e
					
					Ice.Collection.Order.update({_id: order._id}, {$set: {closingDate: closingDate, _payment: payment}})
					console.log("Migrate #{countPayment} payment to #{countOrder} order") 
				else
					Ice.Collection.Order.update({_id: order._id}, {$set: {closingDate: 'none'}})
					console.log("Migrate #{countPayment} payment to #{countOrder} order")
			else
				Ice.Collection.Order.update({_id: order._id}, {$set: {closingDate: 'none'}})
				console.log("Migrate #{countPayment} payment to #{countOrder} order")
				
			
	migrateOrderGroup: ->
		countPayment = 0 
		countOrder = 0 
		orders = Ice.Collection.OrderGroup.find()
		console.log(orders.count())
		orders.forEach (order) ->
			if order.paidAmount != 0
				countOrder += 1 
				payment = {} 
				payments = Ice.Collection.Payment.find(orderId_orderGroupId: order._id, {sort: {paymentDate: 1}})
				console.log(payments.count())
				payments.forEach (obj) ->
					countPayment += 1
					payment[obj._id] =
						customerId: obj.customerId
						staff: obj.staffId
						date: obj.paymentDate
						dueAmount: obj.dueAmount
						paidAmount: obj.paidAmount
						outstandingAmount: obj.outstandingAmount

				if order.closing
					obj = _.findLastKey(payment, (payment) -> 
									payment
								)
					try
						closingDate = payment[obj].date
					catch e
						console.log e					
					Ice.Collection.OrderGroup.update({_id: order._id}, {$set: {closingDate: closingDate, _payment: payment}})
					console.log("Migrate #{countPayment} payment to #{countOrder} order") 
				else
					Ice.Collection.OrderGroup.update({_id: order._id}, {$set: {closingDate: 'none'}})
					console.log("Migrate #{countPayment} payment to #{countOrder} order")
			else
				Ice.Collection.OrderGroup.update({_id: order._id}, {$set: {closingDate: 'none'}})
				console.log("Migrate #{countPayment} payment to #{countOrder} order")
			