var insertTpl = Template.ice_returningReportInsert;
var returningReportGen = Template.ice_returningReportGen;
insertTpl.onRendered(function () {
  datePicker();
})

returningReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var returningReport = Meteor.callAsync(id, 'returningReport', self);
    if (!returningReport.ready()) {
      return false;
    }
    return returningReport.result();
  },
  extractContainer: function (containers) {
    var concate = ''
    containers.forEach(function (container) {
      var returnMoney = container.returnMoney == undefined ? '' :
        container.returnMoney;
      concate += '<ul><li>Lending ID: ' + container.lendingId +
        '</li>' + '<li>Container ID: ' + container.containerId +
        '</li>' +
        '<li>Return Condition: ' + container.condition + '</li>' +
        '<li>Return Money: ' + returnMoney + '</li></ul><hr>'
    });
    return concate;
  }
});

var datePicker = function () {
  var returnDate = $('[name="returnDate"]');
  return DateTimePicker.dateTimeRange(returnDate);
}
