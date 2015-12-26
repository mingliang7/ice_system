var insertTpl = Template.ice_lendingReportInsert;
var lendingReportGen = Template.ice_lendingReportGen;
insertTpl.onRendered(function () {
  datePicker();
  Meteor.typeahead.inject();
})
insertTpl.events({
  'keyup .customer': function (event) {
    if (event.currentTarget.value == '') {
      $('[name="customer"]').val('')
    }
  },
  'click .customer': function () {
    $('.customer').select()
  }
})
insertTpl.helpers({
  search: function (query, sync, callback) {
    var type = {};
    Meteor.call('generalCustomer', query, {}, type, function (err,
      res) {
      if (err) {
        console.log(err);
        return;
      }
      if (res.length > 0) {
        callback(res.map(function (v) {
          var customerType = v.customerType == 'general' ?
            'General' : v.customerType +
            'ថ្ងៃ';
          return {
            value: v._id + ' | ' + v.name + ' | ' +
              customerType,
            _id: v._id
          };
        }));
      } else {
        var displayNoResult = [{
          message: 'No more results!',
          _id: ''
        }]
        callback(displayNoResult.map(function (v) {
          return {
            value: v.message,
            _id: v._id
          }
        }));
      }
    });
  },
  selected: function (event, suggestion, datasetName) {
    // event - the jQuery event object
    // suggestion - the suggestion object
    // datasetName - the name of the dataset the suggestion belongs to
    // TODO your event handler here

    if (suggestion._id != '') {
      $('[name="customer"]').val(suggestion._id)
    }
    if (suggestion._id == '') {
      $('[name="customer"]').val('')
    }
  }
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
        '</li></ul><hr>'
    });
    return concate;
  }
});


var datePicker = function () {
  var lendingDate = $('[name="lendingDate"]');
  return DateTimePicker.dateTimeRange(lendingDate);

}
