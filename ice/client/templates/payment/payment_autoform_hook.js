

AutoForm.hooks({
  ice_paymentInsertTemplate: {
    before: {
      insert: function(doc) {
        doc.branchId = Session.get('currentBranch');
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
    onSuccess: function(formType, result) {
      alertify.success('successfully');
      setTimeout(function(){
        Router.go('ice.payment');
      }, 100);
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});



// extractPayment Detail
