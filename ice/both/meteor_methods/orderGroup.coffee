Meteor.methods
  removeOrderRelatedToGroup: (id)->
    orders = Ice.Collection.Order.find({iceOrderGroupId: id}).fetch()
    if orders isnt undefined
      orders.forEach (order) ->
        Ice.Collection.Order.remove(order._id) 
