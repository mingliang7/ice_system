//Before insert bring to _payment detail to order
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  oldPaidAmount = PaymentUrl.get('oldPaidAmount');
  PaymentUrl.set('oldPaidAmount', null);
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

orderGroupInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  oldPaidAmount = PaymentUrl.get('oldPaidAmount');
  var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId)._payment;
  var payment = paymentDetail(oldPaymentDetail, doc); //extract payment detail
  PaymentUrl.set('oldPaidAmount', null);
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.OrderGroup.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        _payment: payment,
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


AutoForm.hooks({
  ice_paymentUrlInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
        doc.branchId = Session.get('currentBranch');
        if (doc.staffId != undefined && doc.customerId != undefined && doc.orderId_orderGroupId != undefined && doc.paymentDate !== undefined) {
          invoiceUpdate(doc);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      id = Session.get('invioceReportId');
      alertify.success('Successfully');
      alertify.paymentPopUP().close();
      if(!_.isUndefined(id)){
        GenReport(id);
        Session.set('invioceReportId', null)
      }
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