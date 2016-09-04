Meteor.methods({
  groupCustomer: function(customerId){
    return Ice.Collection.Customer.findOne(customerId);
  }
});
