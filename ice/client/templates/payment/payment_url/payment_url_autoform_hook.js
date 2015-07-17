//Before insert
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  oldPaidAmount = Session.get('oldPaidAmount');
  Session.set('oldPaidAmount', null);
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.Order.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.Order.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  }
};

orderGroupInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  oldPaidAmount = Session.get('oldPaidAmount');
  Session.set('oldPaidAmount', null);
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  }
};

invoiceUpdate = function(doc) { //check customer type
  var type;
  type = Ice.ListForReportState.get('type');
  if (type === 'general') {
    return orderInvoiceUpdate(doc);
  } else {
    return orderGroupInvoiceUpdate(doc);
  }
};

var checkType = function(customerId){
  return Ice.Collection.Customer.findOne(customerId).customerType;
}


AutoForm.hooks({
  ice_paymentUrlInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
        doc.cpanel_branchId = Session.get('currentBranch');
        if (doc.staffId != undefined && doc.customerId != undefined && doc.orderId_orderGroupId != undefined && doc.paymentDate !== undefined) {
          invoiceUpdate(doc);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      alertify.success('Successfully');
      Meteor.setTimeout(function(){
        window.close();
        }, 1000
      );
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});

