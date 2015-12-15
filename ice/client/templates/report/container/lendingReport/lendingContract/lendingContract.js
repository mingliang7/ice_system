Template.ice_lendingContractReportGen.helpers({
  data: function () {
    var lendingId = Router.current().params.lendingId;
    var id = JSON.stringify(lendingId);
    var containerReport = Meteor.callAsync(id, 'getLendingDoc',
      lendingId);
    if (!containerReport.ready()) {
      return false;
    }
    return containerReport.result();
  }
})
