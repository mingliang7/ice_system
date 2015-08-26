Ice.Collection.Payment.before.insert(function (userId, doc){
  var prefix = '001-'; 
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
});

Ice.Collection.Payment.after.insert(function (userId, doc) {
    Meteor.defer(function(){
      Meteor._sleepForMs(1000);
        if (doc.outstandingAmount != 0) {
            doc.status = "Partial";
        } else {
            doc.status = "Close";
        }
        invoiceUpdate(doc);
    });
    return console.log('Defer started');
});

Ice.Collection.Payment.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};

    if (modifier.$set.outstandingAmount != 0) {
        modifier.$set.status = "Partial";
    } else {
        modifier.$set.status = "Close";
    }
});

//Before insert bring to _payment detail to order
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function(doc) {
  var newDate = doc.paymentDate;
  var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
  console.log(oldPaymentDetail.paidAmount);
  var payment = paymentDetail(oldPaymentDetail, doc); //extract payment detail
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.Order.direct.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        closingDate: newDate,
        _payment: payment,
        paidAmount: oldPaymentDetail.paidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.Order.direct.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        _payment: payment,
        paidAmount: oldPaymentDetail.paidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  }
};

orderGroupInvoiceUpdate = function(doc) {
  var oldPaidAmount;
  var newDate = doc.paymentDate;
  var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId);
  var payment = paymentDetail(oldPaymentDetail, doc); //extract payment detail
  if (doc.outstandingAmount === 0) {
    return Ice.Collection.OrderGroup.direct.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        closing: true,
        _payment: payment,
        closingDate: newDate,
        paidAmount: oldPaymentDetail.paidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  } else {
    return Ice.Collection.OrderGroup.direct.update({
      _id: doc.orderId_orderGroupId
    }, {
      $set: {
        _payment: payment,
        paidAmount: oldPaymentDetail.paidAmount + doc.paidAmount,
        outstandingAmount: doc.outstandingAmount
      }
    });
  }
};

invoiceUpdate = function(doc) { //check customer type
  var type;
  type = checkType(doc.customerId);
  if (type == 'general') {
    return orderInvoiceUpdate(doc);
  } else {
    return orderGroupInvoiceUpdate(doc);
  }
};

var checkType = function(customerId){
  return Ice.Collection.Customer.findOne(customerId).customerType;
}


// extractPayment Detail
var paymentDetail = function(oldPaymentDetail, doc){
  var payment = oldPaymentDetail._payment == undefined ? {} : oldPaymentDetail._payment // check if oldPaymentDetail exist
    payment[doc._id] = {
      customerId: doc.customerId,
      staff: doc.staffId,
      date: doc.paymentDate,
      dueAmount: doc.dueAmount,
      paidAmount: doc.paidAmount,
      outstandingAmount: doc.outstandingAmount
  }
  return payment; 
}