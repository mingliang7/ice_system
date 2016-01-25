AutoForm.hooks({
  ice_paymentUrlInsertTemplate: {
    before: {
      insert: function (doc) {
        doc.branchId = Session.get('currentBranch');
        return doc;
      }
    },
    onSuccess: function (formType, result) {
      id = Session.get('invioceReportId');
      console.log(id)
      alertify.paymentPopUP().close();
      if (!_.isUndefined(id) || id == null) {
        Router.go('ice.invoiceReportGen', {
          id: id
        });
        Session.set('invioceReportId', undefined)
      }
    },
    onError: function (formType, error) {
      return alertify.error(error.message);
    }
  }
});
