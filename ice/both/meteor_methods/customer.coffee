Meteor.methods
  getCustomerName: (id) ->
      customer = Ice.Collection.Customer.findOne(id)
      customer._id + ' | ' + customer.name
