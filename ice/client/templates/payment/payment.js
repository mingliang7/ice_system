Session.setDefault('customer', '');
Payment = new ReactiveObj();
Template.ice_paymentInsertTemplate.onRendered(function() {
  return createNewAlertify(['staffAddOn','invoiceAddOn','customerAddOn']);
});
Template.ice_payment.onRendered(function() {
  return createNewAlertify(['paymentForm','staffAddOn','invoiceAddOn','customerAddOn']);
});

Template.ice_payment.helpers({
  foo: function() {
    var self;
    if (this !== null) {
      self = this;
      Session.set(customer, findCustomer(self.customerId));
    }
    Session.get('customer');
  }
});

Template.ice_payment.events({
  'click .insert': function() {
  	Session.set('checkIfUpdate', false);
    Router.go('/ice/new/payment');
   },
  'click .remove': function() {
  	var flag = checkAvailablity(this);
  	flag ? onRemoved(this) : alertify.warning('Sorry! invoice ' + this._id + ' is not a last record :( ');
  },
  'click .show': function() {
     alertify.paymentForm(fa('eye', 'Payment'), renderTemplate(Template.ice_paymentShowTemplate, this));
  },
  'click .update': function(){
  	var flag = checkAvailablity(this);
    doc = Ice.Collection.Payment.findOne(this._id);
    if(flag) {
      Ice.ListForReportState.set('customer', doc.customerId)
      Session.set('checkIfUpdate', true); 
      Payment.set('paymentPaidAmount', doc.paidAmount); // parsing old paid amount tot payment_autoform_hook.js
      Payment.set('paymentInvoiceId', doc.orderId_orderGroupId);// parsing old paid amount tot payment_autoform_hook.js
      Payment.set('paymentId', doc._id); //parsing id to paymentDetail()
      Router.go('ice.ice_paymentUpdate',{id: doc._id});
  	}else{
  		alertify.warning('Sorry! invoice ' + doc._id + ' is not a last record :( ')
  	}
  }
});

Template.ice_paymentInsertTemplate.events({
  'click .customerAddOn': function  () {
      alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(Template.ice_insertTemplate));
  },
  'click .invoiceAddOn': function  () {
    alertify.invoiceAddOn(fa('shopping-cart', 'Order'), renderTemplate(Template.ice_orderInsertTemplate)).maximize();
  },
  'click .staffAddOn': function  () {
    alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate));
  },
  'change [name="customerId"]': function(e) {
    var customer;
    customer = $(e.currentTarget).val();
    if (customer !== '') {
      $('[name="orderId_orderGroupId"]').attr('disabled', false);
    } else {
      $('[name="orderId_orderGroupId"]').attr('disabled', true);
    }
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
      $('[name="outstandingAmount"]').val(0);
    } else {
      currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="outstandingAmount"]').val(0);
    }
  },
  'keyup [name="paidAmount"]': function() {
    var dueAmount, paidAmount;
    try{
      paidAmount = $('[name="paidAmount"]').val();
    }catch(e){
      console.log(e)     
    }
    dueAmount = parseInt($('[name="dueAmount"]').val());
    if (parseInt(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});
Template.ice_paymentUpdateTemplate.events({
	'keyup [name="paidAmount"]': function () {
		dueAmount = $('[name="dueAmount"]').val();
		paidAmount = $('[name="paidAmount"]').val();
    dueAmount = parseFloat(dueAmount);
    paidAmount = parseFloat(paidAmount)
    outstandingAmount = dueAmount - paidAmount
    console.log(paidAmount)
    if(paidAmount > dueAmount){
      $('[name="paidAmount"]').val(dueAmount);
      $('[name="outstandingAmount"]').val(0)
    }else{
		  $('[name="outstandingAmount"]').val(outstandingAmount);
    }
	}
});

Template.ice_paymentShowTemplate.helpers({
  format: function(value) {
    return numeral(value).format('0,0');
  },
  customer: function(id){
  	var name = Ice.Collection.Customer.findOne(id).name;
  	return id + '(' + name + ')';
  }
});

//functions
var findCustomer = function(id) {
  var name;
  name = Ice.Collection.Customer.findOne(id).name;
  return name;
};


var removeDoc = function(doc) {
  var doc = doc;
  alertify.confirm((fa('remove'), 'Remove Payment'), 'Are you sure to remove' + doc._id + '?', function(){
	  		Ice.Collection.Payment.remove(doc._id, function(error){
            if(checkType(doc) == 'general'){
              removeOrderPayment(doc);
            }else{
              removeOrderGroupPayment(doc);     
            }         
             alertify.message('Successfully remove')
        });
        }, null);

} 

var checkType = function(customer){
  customerId = customer.customerId
	return Ice.Collection.Customer.findOne(customerId).customerType;
}

var checkAvailablity = function(doc){
  	var currentPayment = doc.paymentDate;
  	var flag = undefined; 
  	var payments = Ice.Collection.Payment.find({customerId: doc.customerId, orderId_orderGroupId: doc.orderId_orderGroupId});
  	payments.forEach(function (payment) {
  		flag = (currentPayment >= payment.paymentDate) ? true : false
  	});
  	return flag;
} 
//remove payment and update order
var onRemoved = function(doc){
 removeDoc(doc);
}



var removeOrderPayment = function(doc){
    var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId)._payment;
    delete oldPaymentDetail[doc._id];
    var oldOrder = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
    if($.isEmptyObject(oldPaymentDetail)){
      Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$unset:{_payment: ''}, $set: {paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false, closingDate: 'none'}});
    }else{
      Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$set: {_payment: oldPaymentDetail, paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false, closingDate: 'none'}});
    }
}

var removeOrderGroupPayment = function(doc){
  var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId)._payment;
  delete oldPaymentDetail[doc._id];
   var oldOrder = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId);
  if($.isEmptyObject(oldPaymentDetail)){
    Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId}, 
              {$unset: {_payment: ''},
                $set: 
                {
                  paidAmount: oldOrder.paidAmount - doc.paidAmount, 
                  outstandingAmount: doc.paidAmount + doc.outstandingAmount, 
                  closing: false, closingDate: 'none'
                }
              });
  }else{
    Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId}, 
            {
              $set: 
              {
                _payment: oldPaymentDetail,
                paidAmount: oldOrder.paidAmount - doc.paidAmount, 
                outstandingAmount: doc.paidAmount + doc.outstandingAmount, 
                closing: false, closingDate: 'none'
              }
            });
  }
}

var datePicker = function(currentInvoiceId){
  maxDate = '';
  payments = Ice.Collection.Payment.find({orderId_orderGroupId: currentInvoiceId});
  if(payments != undefined){
    payments.forEach(function (payment) {
      maxDate = maxDate > payment.paymentDate ? maxDate : payment.paymentDate
    });
    maxDate;
  }
  var paymentDate = $('[name="paymentDate"]')
  return maxDate == '' ? DateTimePicker.dateTime(paymentDate) : paymentDate.data('DateTimePicker').minDate(maxDate);
}