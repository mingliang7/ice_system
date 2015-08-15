var datePicker, fillInDetail, selectCustomer, selectInvoice;
PaymentUrl = new ReactiveObj(); 
Template.ice_paymentUrlInsertTemplate.onRendered(function() {
  datePicker(this.data._id);
});

Template.ice_paymentUrlInsertTemplate.events({
  'keyup [name="paidAmount"]': function() {
    var dueAmount, paidAmount;
    dueAmount = parseInt($('[name="dueAmount"]').val());
    try{
      paidAmount = $('[name="paidAmount"]').val();
    }catch(e){
      console.log(e)
    }
    if (parseFloat(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});

datePicker = function(currentInvoiceId) {
  paymentDate = $('[name="paymentDate"]');
  return DateTimePicker.dateTime(paymentDate); 
};
