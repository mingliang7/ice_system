Meteor.methods
  correctOrderCustomer: (date)->
    orders = Ice.Collection.Order.find({orderDate: {$lte: date}}).fetch();
    orders.forEach (order) ->
      customer = Meteor.call('getCustomer', order.iceCustomerId);
      if(order._customer.name != customer.name)
        console.log('update order #' + order._id);
        Ice.Collection.Order.direct.update({_id: order._id},
          {
            $set:{
              '_customer.name': customer.name,
              '_customer.customerType': customer.customerType
            }
          }
        )

    console.log('Finished....! with ' + orders.length)
