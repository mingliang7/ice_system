Session.setDefault('customer', '');
Template.ice_payment.onRendered(function() {
  return createNewAlertify('paymentForm');
});


Template.ice_payment.helpers({
  foo: function() {
    var self;
    if (this !== null) {
      self = this;
      Session.set(customer, findCustomer(self.customerId));
    }
    return Session.get('customer');
  }
});

Template.ice_payment.events({
  'click .insert': function() {
  	Session.set('checkIfUpdate', false);
    return alertify.paymentForm(fa('money', 'Payment'), renderTemplate(Template.ice_paymentInsertTemplate)).maximize();
   },
  'click .remove': function() {
  	var flag = checkAvailablity(this);
  	flag ? updateInvoice(this) : alertify.warning('Sorry! invoice ' + this._id + ' is not a last record :( ');
  },
  'click .show': function() {
     return alertify.paymentForm(fa('eye', 'Payment'), renderTemplate(Template.ice_paymentShowTemplate, this));
  },
  'click .update': function(){
  	var flag = checkAvailablity(this);
  	if(flag) {
  		Ice.ListForReportState.set('customer', this.customerId)
  		Session.set('checkIfUpdate', true);
  		Session.set('paidAmount', this.paidAmount);
  		Session.set('invoiceId', this.orderId_orderGroupId);
  		alertify.paymentForm(fa('money', 'Update Payment'), renderTemplate(Template.ice_paymentUpdateTemplate, this)).maximize(); 
  		
  	}else{
  		alertify.warning('Sorry! invoice ' + this._id + ' is not a last record :( ')
  	}
  }
});

Template.ice_paymentInsertTemplate.events({
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
    datePicker(currentInvoiceId);    
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

Template.ice_paymentUpdateTemplate.events({
	'keyup [name="paidAmount"]': function () {
		dueAmount = parseInt($('[name="dueAmount"]').val());
		paidAmount = parseInt($('[name="paidAmount"]').val());
		$('[name="outstandingAmount"]').val(dueAmount - paidAmount);
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

var findCustomer = function(id) {
  var name;
  name = Ice.Collection.Customer.findOne(id).name;
  return name;
};

var removeDoc = function(id) {
	alertify.confirm((fa('remove'), 'Remove Payment'), 'Are you sure to remove' + id + '?', function(){
	  		Ice.Collection.Payment.remove(id, function(error){
	  			error == undefined ? alertify.message(error.message) : alertify.message('Successfully remove') ;
	  		});
  			}, null);
} 

var checkType = function(customerId){
	return Ice.Collection.Customer.findOne(customerId).customerType;
}

var updateInvoice = function(doc){
	if(checkType(doc.customerId) == 'general'){
  				var oldOrder = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
  				Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$set: {paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false}});
  			}else{
  				var oldOrder = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId);
  				Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId}, {$set: {paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false}});
  			}
  			removeDoc(doc._id);
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

var datePicker = function(currentInvoiceId){
  payments = Ice.Collection.Payment.find(currentInvoiceId);
  var paymentDate = $('[name="paymentDate"]')
  DateTimePicker.dateTime(paymentDate);
}