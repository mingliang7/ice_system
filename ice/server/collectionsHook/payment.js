Ice.Collection.Payment.before.insert(function (userId, doc) {
  var prefix = '001-';
  if (doc.outstandingAmount != 0) {
    doc.status = "Partial";
  } else {
    doc.status = "Close";
  }
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
});

Ice.Collection.Payment.after.insert(function (userId, doc) {
  var order = StateId.get(doc.orderId_orderGroupId);
  if (!_.isUndefined(order)) {
    order._payment = doc
    StateId.set(doc.orderId_orderGroupId, order);
  }
  Meteor.defer(function () {
    Meteor._sleepForMs(1000);
    invoiceUpdate(doc);
  });
  return console.log('Defer started');
});

Ice.Collection.Payment.before.update(function (userId, doc, fieldNames,
  modifier, options) {
  modifier.$set = modifier.$set || {};

  if (modifier.$set.outstandingAmount != 0) {
    modifier.$set.status = "Partial";
  } else {
    modifier.$set.status = "Close";
  }
});
Ice.Collection.Payment.after.update(function (userId, doc, fieldNames, modifier,
  options) {
  var oldDoc = this.previous
  Meteor.defer(function () {
    Meteor._sleepForMs(2000);
    updateInvoice(oldDoc, modifier.$set);
  });
  console.log('Payment Defer started');
});
//Before insert bring to _payment detail to order
var invoiceUpdate, orderGroupInvoiceUpdate, orderInvoiceUpdate;
orderInvoiceUpdate = function (doc) {
  var newDate = doc.paymentDate;
  var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
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

orderGroupInvoiceUpdate = function (doc) {
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

invoiceUpdate = function (doc) { //check customer type
  var type;
  type = checkType(doc.customerId);
  if (type == 'general') {
    return orderInvoiceUpdate(doc);
  } else {
    return orderGroupInvoiceUpdate(doc);
  }
};

var checkType = function (customerId) {
  return Ice.Collection.Customer.findOne(customerId).customerType;
}


// extractPayment Detail
var paymentDetail = function (oldPaymentDetail, doc) {
  var payment = oldPaymentDetail._payment == undefined ? {} :
    oldPaymentDetail._payment // check if oldPaymentDetail exist
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

//after update
var checkType = function (customerId) {
  return Ice.Collection.Customer.findOne(customerId).customerType;
}

// Before update
var updateInvoice = function (oldDoc, doc) {
  console.log(doc);
  var invoiceId = oldDoc.orderId_orderGroupId;
  var oldPaidAmount = oldDoc.paidAmount;
  customerId = oldDoc.customerId;
  if (checkType(customerId) == 'general') {
    var oldOrder = Ice.Collection.Order.findOne(invoiceId);
    var newPaidAmount = 0;
    var outstandingAmount = 0;
    var payment = paymentDetailUpdate(oldOrder._payment, oldDoc, doc); // update _payment
    if (oldPaidAmount > doc.paidAmount) {
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = doc.dueAmount - doc.paidAmount
    } else {
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }
    var newDate = doc.paymentDate;
    var closing = (outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.Order.update({
      _id: invoiceId
    }, {
      $set: {
        _payment: payment,
        paidAmount: newPaidAmount,
        outstandingAmount: outstandingAmount,
        closing: closing,
        closingDate: closingDate
      }
    });

  } else {
    var oldOrder = Ice.Collection.OrderGroup.findOne(invoiceId);
    var payment = paymentDetailUpdate(oldOrder._payment, oldDoc, doc)
    var newPaidAmount = 0;
    var outstandingAmount = 0;
    if (oldPaidAmount > doc.paidAmount) {
      newPaidAmount = oldOrder.paidAmount - (oldPaidAmount - doc.paidAmount);
      outstandingAmount = doc.dueAmount - doc.paidAmount
    } else {
      newPaidAmount = (doc.paidAmount - oldPaidAmount) + oldOrder.paidAmount;
      outstandingAmount = doc.dueAmount - doc.paidAmount
    }
    var newDate = doc.paymentDate;
    var closing = (outstandingAmount == 0) ? true : false;
    var closingDate = (outstandingAmount == 0) ? newDate : 'none';
    Ice.Collection.OrderGroup.update({
      _id: invoiceId
    }, {
      $set: {
        paidAmount: newPaidAmount,
        _payment: payment,
        outstandingAmount: outstandingAmount,
        closing: closing,
        closingDate: closingDate
      }
    });
  }
}


var paymentDetailUpdate = function (oldPaymentDetail, oldDoc, doc) {
  var payment = oldPaymentDetail == undefined ? {} : oldPaymentDetail // check if oldPaymentDetail exist
  var id = oldDoc._id;
  if (id != undefined) {
    payment[id] = {
      customerId: doc.customerId,
      staff: doc.staffId,
      date: doc.paymentDate,
      dueAmount: doc.dueAmount,
      paidAmount: doc.paidAmount,
      outstandingAmount: doc.outstandingAmount
    }
  } else {
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
