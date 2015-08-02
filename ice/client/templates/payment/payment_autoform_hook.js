//Before insert
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  oldPaidAmount = Session.get('oldPaidAmount');
  if (doc.outstandingAmount === 0) {
    debugger
    return Ice.Collection.Order.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        closingDate: newDate,
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
  var newDate = doc.paymentDate;
  oldPaidAmount = Session.get('oldPaidAmount');
  Session.set('oldPaidAmount', null);
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        closingDate: newDate,
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

// Before update
var updateInvoice = function(doc){
  var invoiceId = Payment.get('paymentInvoiceId');
  var oldPaidAmount = Payment.get('paymentPaidAmount');
  customerId = Ice.ListForReportState.get('customer');
  if(checkType(customerId) == 'general'){
    var oldOrder = Ice.Collection.Order.findOne(invoiceId);
    var newPaidAmount = 0;
    var outstandingAmount = 0;
    if(oldPaidAmount > doc.paidAmount){
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = (oldPaidAmount - doc.paidAmount) +  oldOrder.outstandingAmount
    }else{
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = oldOrder.outstandingAmount - (doc.paidAmount - oldPaidAmount);
    }
    var newDate = doc.paymentDate;
    var closing = ( outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.Order.update({_id: invoiceId}, 
      {$set: {
        paidAmount: newPaidAmount, 
        outstandingAmount: outstandingAmount, 
        closing: closing,
        closingDate: closingDate}
      }
    );
    
  }else{
    var oldOrder = Ice.Collection.OrderGroup.findOne(invoiceId);
    var newPaidAmount = 0;
    var outstandingAmount = 0;
    if(oldPaidAmount > doc.paidAmount){
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = (oldPaidAmount - doc.paidAmount) +  oldOrder.outstandingAmount
    }else{
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = oldOrder.outstandingAmount - (doc.paidAmount - oldPaidAmount) ;
    }
    var newDate = doc.paymentDate;
    var closing = ( outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.OrderGroup.update({_id: invoiceId}, 
      {$set: 
        {paidAmount: newPaidAmount, 
          outstandingAmount: outstandingAmount, 
          closing: closing,
          closingDate: closingDate
        }
      }
    );
  }
}
AutoForm.hooks({
  ice_paymentInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
        doc.branchId = Session.get('currentBranch');
        if (doc.customerId && doc.orderId_orderGroupId && doc.paymentDate !== undefined) {
          invoiceUpdate(doc);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      $('select').each(function(){
        $(this).select2('val', '');
      });
      Payment.set('paymentInvoiceId', null);
      Payment.set('paymentPaidAmount', null);
      alertify.success('successfully');
    },
    onError: function(formType, error) {
      Payment.set('paymentInvoiceId', null);
      Payment.set('paymentPaidAmount', null);
      alertify.error(error.message);
    }
  }
});

AutoForm.hooks({
  ice_paymentUpdateTemplate: {
    before:{
      update: function(doc){
        if(doc.$set.paymentDate != undefined){
          updateInvoice(doc.$set);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      alertify.paymentForm().close();
      return alertify.success('successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});