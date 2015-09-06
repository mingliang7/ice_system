Meteor.methods
  getCustomerName: (id) ->
      customer = Ice.Collection.Customer.findOne(id)
      if(customer)
        customer._id + ' | ' + customer.name

  getCustomer: (id) ->
    Ice.Collection.Customer.findOne(id)
