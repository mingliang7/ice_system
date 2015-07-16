var datePicker;

Template.ice_staffReport.onRendered(function() {
  return datePicker();
});

Template.ice_staffReport.events({
  'change [name="customerType"]': function(e) {
    var value;
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customerType', value);
  },
  'change [name="date"]': function(e) {
    value = $('[name="date"]').val().split(' To ')
    Ice.ListForReportState.set('dateRamge', value);
    debugger
  }
});

datePicker = function() {
  var date;
  date = $('[name="date"]');
  return DateTimePicker.dateTimeRange(date);
};