var insertTpl = Template.ice_lendingBalanceReportInsert;
var lendingReportGen = Template.ice_lendingBalanceReportGen;
insertTpl.onRendered(function () {
  datePicker();
})

lendingReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var lendingBalanceReport = Meteor.callAsync(id,
      'lendingBalanceReport', self);
    if (!lendingBalanceReport.ready()) {
      return false;
    }
    return lendingBalanceReport.result();
  },
  extractContainer: function (containers) {
    var concate = ''
    containers.forEach(function (container) {
      concate += '<ul><li>Container ID: ' + container.containerId +
        '</li>' + '<li>Condition: ' + container.condition +
        '</li></ul><hr>'
    });
    return concate;
  }
});


var datePicker = function () {
  var lendingDate = $('[name="lendingDate"]');
  return DateTimePicker.dateTimeRange(lendingDate);

}
