var insertTpl = Template.ice_returningReportInsert;
var returningReportGen = Template.ice_returningReportGen;
insertTpl.onRendered(function () {
  datePicker();
  Meteor.typeahead.inject();
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
