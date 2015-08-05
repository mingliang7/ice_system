//Before insert
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  oldPaidAmount = Session.get('oldPaidAmount');
  var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId)._payment;
  var payment = paymentDetail(oldPaymentDetail, doc); //extract payment detail
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.Order.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        closingDate: newDate,
        _payment: payment,
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.Order.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        _payment: payment,
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  }
};

orderGroupInvoiceUpdate = function(doc) { // for groupInvoice
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  oldPaidAmount = Session.get('oldPaidAmount');
  var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId)._payment;
  var payment = paymentDetail(oldPaymentDetail, doc); //extract payment detail
  Session.set('oldPaidAmount', null);
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        closingDate: newDate,
        _payment: payment,
        paidAmount: oldPaidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        _payment: payment,
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
    var payment = paymentDetail(oldOrder._payment, doc); // update _payment 
    if(oldPaidAmount > doc.paidAmount){
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }else{
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }
    var newDate = doc.paymentDate;
    var closing = ( outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.Order.update({_id: invoiceId}, 
      {$set: {
        _payment: payment,
        paidAmount: newPaidAmount, 
        outstandingAmount: outstandingAmount, 
        closing: closing,
        closingDate: closingDate}
      }
    );
    
  }else{
    var oldOrder = Ice.Collection.OrderGroup.findOne(invoiceId);
    var payment = paymentDetail(oldOrder._payment, doc)
    var newPaidAmount = 0;
    var outstandingAmount = 0;
    if(oldPaidAmount > doc.paidAmount){
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }else{
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }
    var newDate = doc.paymentDate;
    var closing = ( outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.OrderGroup.update({_id: invoiceId}, 
      {$set: 
        {paidAmount: newPaidAmount, 
          _payment: payment,
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
      alertify.success('successfully');
      Payment.set('paymentInvoiceId', null);
      Payment.set('paymentPaidAmount', null);
    },
    onError: function(formType, error) {
      Payment.set('paymentInvoiceId', null); Payment.set('paymentPaidAmount', null);
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



// extractPayment Detail
var paymentDetail = function(oldPaymentDetail, doc){
  var payment = oldPaymentDetail == undefined ? {} : oldPaymentDetail // check if oldPaymentDetail exist
  var id = Payment.get('paymentId');
  if(id != undefined){
    payment[id] = {
      customerId: doc.customerId,
      staff: doc.staffId,
      date: doc.paymentDate,
      dueAmount: doc.dueAmount,
      paidAmount: doc.paidAmount,
      outstandingAmount: doc.outstandingAmount
    }
    Payment.set('paymentId', undefined); // set Payment ID back to undefine
  }else{
     payment[doc._id] = {
      customerId: doc.customerId,
      staff: doc.staffId,
      date: doc.paymentDate,
      dueAmount: doc.dueAmount,
      paidAmount: doc.paidAmount,
      outstandingAmount: doc.outstandingAmount
    }
  }
  return payment; 
}

