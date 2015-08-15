
AutoForm.hooks({
  ice_paymentUrlInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12);
        doc.branchId = Session.get('currentBranch');
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
