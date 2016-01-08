Template.ice_lendingContractReportGen.helpers({
  check: function (age) {
    return age == undefined ? false : true;
  },
  data: function () {
    var lendingId = Router.current().params.lendingId;
    var id = JSON.stringify(lendingId);
    var containerReport = Meteor.callAsync(id, 'getLendingDoc',
      lendingId);
    if (!containerReport.ready()) {
      return false;
    }
    return containerReport.result();
  },
  getUnit: function (id) {
    var container = ReactiveMethod.call('findContainer', id);
    return container.unit;
  }
})
