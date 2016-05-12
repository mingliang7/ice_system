Meteor.methods
  correctOrderCustomer: (date)->
    count = 0
    orders = Ice.Collection.Order.find({orderDate: {$lte: date}}).fetch();
    orders.forEach (order) ->
      customer = Meteor.call('getCustomer', order.iceCustomerId);
      if(order._customer.name != customer.name)
        count += 1
        Ice.Collection.Order.direct.update({_id: order._id},
          {
            $set:{
              '_customer.name': customer.name,
              '_customer.customerType': customer.customerType
            }
          }
        )
  correctOrderGroupCustomer: (date)->
    count = 0
    orders = Ice.Collection.OrderGroup.find({endDate: {$lte: date}}).fetch();
    orders.forEach (order) ->
      customer = Meteor.call('getCustomer', order.iceCustomerId);
      if(order._customer.name != customer.name)
        count += 1
        Ice.Collection.OrderGroup.direct.update({_id: order._id},
          {
            $set:{
              '_customer.name': customer.name,
              '_customer.customerType': customer.customerType
            }
          }
        )
