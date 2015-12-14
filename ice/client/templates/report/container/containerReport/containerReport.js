var indexTpl = Template.ice_containerReport;
var containerReportGen = Template.ice_containerReportGen;
containerReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var containerReport = Meteor.callAsync(id, 'containerReport', self);
    if (!containerReport.ready()) {
      return false;
    }
    return containerReport.result();
  }
});
indexTpl.onRendered(function () {
  datePicker();
})
var datePicker = function () {
  var importDate = $('[name="importDate"]');
  return DateTimePicker.dateTimeRange(importDate);
}
