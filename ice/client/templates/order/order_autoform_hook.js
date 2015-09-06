var generateReport, getRank, rangeDate, setOrderGroup;

this.Print = new ReactiveObj();

generateReport = function(id) {
  var doc, q, url;
  doc = Ice.Collection.Order.findOne(id);
  url = "invoiceReportGen/" + id;
  return window.open(url, '_blank');
};

generatePayment = function(id){
  setTimeout(function(){
    Meteor.call('orderId', id, function(err, doc){
      alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, doc));
    });
  },200);
}
this.GenReport = generateReport;

Template.ice_paymentUrlInsertTemplate.events({ // on change for payment popup
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

AutoForm.hooks({
  ice_orderInsertTemplate: {
    before: {
      insert: function(doc) {
        doc.branchId = Session.get('currentBranch');
        type = Session.get('orderCustomerType');
        if( type == 'general'){
          doc.paidAmount = 0;
          doc.outstandingAmount = doc.total;
          doc.closingDate = 'none';
          doc.closing = false;
        }
        return doc;
      }
    },
    after: { // generate report or payment
      insert: function(err, _id) {
        if (err) {
          Print.set('print', false);
          Print.set('pay', false)
        } else {
          setTimeout(function(){
            checkIfReady(_id);
          }, 1000);
        }
      }
    },
    onSuccess: function(formType, result) {
      Session.set('orderCustomerType', undefined);
      $('select').each(function(){
        $(this).select2('val', '');
      });
      Session.set('ice_customer_id', null); //set iceCustomerId to null
      alertify.order().close()
       Loading.set('loadingState', false)
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
      Loading.set('loadingState', false)
      return alertify.error(error.message);
    }
  },
  ice_orderUpdateTemplate: {
    before: {
      update: function(doc){
        // if ((doc.$set.orderDate && doc.$set.iceCustomerId && doc.$set.iceOrderDetail) !== void 0) {
        //   updateOrderGroup(doc.$set);
        // }
        type = Session.get('orderCustomerType')
        if(type){
          doc.paidAmount = 0;
          doc.outstandingAmount = doc.total;
          doc.closing = false;
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      alertify.order().close()
      Session.set('orderCustomerType', undefined);
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});
checkType = function(id){
  return Ice.Collection.Customer.findOne(id).customerType;
}
var checkIfReady = function(aid){
  var id = undefined;
  Meteor.call('getOrderId', aid, function(err, id){
    if (err) {
      console.log(err);
    }else{
      print = Print.get('print');
      pay = Print.get('pay');
      saveNpay = Print.get('saveNpay');
      if (print === true) {
        generateReport(id);
        return Print.set('print', false);
      }else if (pay == true){
        Print.set('pay', false);
        generatePayment(id);
        Session.set('invioceReportId', id)
      }else if (saveNpay == true){
        Print.set('saveNpay', false);
        generatePayment(id)
      }
    }
  });
}
