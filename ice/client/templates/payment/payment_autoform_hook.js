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

invoiceUpdate = function(doc) {
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

var updateInvoice = function(doc){
  var invoiceId = Session.get('invoiceId');
  if(checkType(doc.customerId) == 'general'){
    var oldOrder = Ice.Collection.Order.findOne(invoiceId);
    Ice.Collection.Order.update({_id: invoiceId}, {$set: {paidAmount: oldOrder.paidAmount - doc.outstandingAmount, outstandingAmount: oldOrder.outstandingAmount + doc.outstandingAmount, closing: false}});
    
  }else{
    var oldOrder = Ice.Collection.OrderGroup.findOne(invoiceId);
    Ice.Collection.OrderGroup.update({_id: invoiceId}, {$set: {paidAmount: oldOrder.paidAmount - doc.outstandingAmount, outstandingAmount: oldOrder.outstandingAmount + doc.outstandingAmount, closing: false}});
  }
}
AutoForm.hooks({
  ice_paymentInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
        doc.cpanel_branchId = Session.get('currentBranch');
        if (doc.customerId && doc.orderId_orderGroupId !== void 0) {
          invoiceUpdate(doc);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      return alertify.success('successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});

AutoForm.hooks({
  ice_paymentUpdateTemplate: {
    before:{
      update: function(doc){
        updateInvoice(doc.$set);
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      return alertify.success('successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});