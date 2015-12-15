var insertTpl = Template.ice_lendingReportInsert;
var lendingReportGen = Template.ice_lendingReportGen;
insertTpl.onRendered(function () {
  datePicker();
})

lendingReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var lendingReport = Meteor.callAsync(id, 'lendingReport', self);
    if (!lendingReport.ready()) {
      return false;
    }
    return lendingReport.result();
  },
  extractContainer: function (containers) {
    var concate = ''
    containers.forEach(function (container) {
      concate += '<ul><li>Container ID: ' + container.containerId +
        '</li>' + '<li>Condition: ' + container.condition +
        '</li></ul>'
    });
    return concate;
  }
});


var datePicker = function () {
  var lendingDate = $('[name="lendingDate"]');
  return DateTimePicker.dateTimeRange(lendingDate);

}
