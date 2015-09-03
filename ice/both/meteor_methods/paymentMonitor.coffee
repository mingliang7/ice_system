Meteor.methods
  generalMonitor: () ->
    Ice.Collection.Order.find({
      closing: false
    }, {
      sort: {
        orderDate: -1
      }
    , limit: 20}).fetch()

  groupMonitor: () ->
    Ice.Collection.OrderGroup.find({
      closing: false
    }, {limit: 20}).fetch();
