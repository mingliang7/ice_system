Meteor.methods
  removeInvoiceLog: (selector)->
    Ice.Collection.RemoveInvoiceLog.insert(selector) 
