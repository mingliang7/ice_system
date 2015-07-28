var datePicker, fillInDetail, selectCustomer, selectInvoice;

Template.ice_paymentUrlInsertTemplate.onRendered(function() {
  console.log(this.data);
  selectCustomer(this.data);
});

Template.ice_paymentUrlInsertTemplate.events({
  'click .close': function() {
    window.close()
  },
  'change [name="customerId"]': function(e) {
    var customer;
    customer = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customer', customer);
  },
  'change [name="orderId_orderGroupId"]': function(e) {
    var currentInvoice, currentInvoiceId, type;
    currentInvoiceId = $(e.currentTarget).val();
    datePicker(currentInvoiceId);
    type = Ice.ListForReportState.get('type');
    if (type === 'general') {
      currentInvoice = Ice.Collection.Order.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else {
      currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    }
  },
  'keyup [name="paidAmount"]': function() {
    var dueAmount, paidAmount;
    dueAmount = parseInt($('[name="dueAmount"]').val());
    paidAmount = $('[name="paidAmount"]').val();
    if (parseInt(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      return $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      return $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});

datePicker = function(currentInvoiceId) {
  var maxDate, paymentDate, payments;
  maxDate = '';
  payments = Ice.Collection.Payment.find({
    orderId_orderGroupId: currentInvoiceId
  });
  if (payments !== void 0) {
    payments.forEach(function(payment) {
      maxDate = maxDate > payment.paymentDate ? maxDate : payment.paymentDate;
    });
    maxDate;

  }
  paymentDate = $('[name="paymentDate"]');
  if (maxDate === '') {
    return DateTimePicker.dateTime(paymentDate);
  } else {
    return paymentDate.data('DateTimePicker').minDate(maxDate);
  }
};

selectCustomer = function(self) {
  self = self;
  return Meteor.setTimeout(function() {
    $('[name="customerId"]').select2('val', self.iceCustomerId);
    Ice.ListForReportState.set('customer', self.iceCustomerId);
    selectInvoice(self._id);
    fillInDetail(self.outstandingAmount, self.paidAmount, self.outstandingAmount);
    datePicker(self._id)
  }, 100);
};

selectInvoice = function(invoiceId) {
  return Meteor.setTimeout(function() {
    $('[name="orderId_orderGroupId"]').select2('val', invoiceId);
  }, 100);

};

fillInDetail = function(dueAmount, paidAmount, outstandingAmount) {
  $('[name="paidAmount"]').val(outstandingAmount);
  $('[name="dueAmount"]').val(dueAmount);
  $('[name="outstandingAmount"]').val(0);
  return Session.set('oldPaidAmount', parseInt(paidAmount));
};