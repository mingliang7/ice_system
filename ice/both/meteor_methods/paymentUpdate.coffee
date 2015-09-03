Meteor.methods
  updatePayment: (id)->
    Ice.Collection.Payment.findOne(id)
