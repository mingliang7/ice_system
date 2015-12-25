/************ Generate *************/
Template.ice_invoiceGeneralReport.onRendered(function () {
  datePicker();
  Meteor.typeahead.inject()
});
Template.ice_invoiceGeneralReport.helpers({
  search: function (query, sync, callback) {
    Meteor.call('generalCustomer', query, {}, 'general', function (err,
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
          message: 'No more Results'
        }]
        callback(displayNoResult.map(function (v) {
          return {
            value: v.message
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

    $('[name="customer"]').val(suggestion._id)
  }
});
Template.ice_invoiceGeneralReport.events({
  'keyup .customer': function (event) {
    if (event.currentTarget.value == '') {
      $('[name="customer"]').val('')
    }
  }
})
Template.invoiceGeneralReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var generalOrders = Meteor.callAsync(id, 'generalOrder', self)
    if (!generalOrders.ready()) {
      return false;
    }
    return generalOrders.result();
  },

  extract: function (item) {
    var concate = ''
    item.forEach(function (obj) {
      concate += '<tr><td colspan="2">' + itemName(Object.keys(obj).join(
        '')) + '</td>'
      for (var k in obj) {
        concate += '<td>' + obj[k].qty + '</td>' +
          '<td>' + formatKH(obj[k].price) + '</td>' +
          '<td>' + itemDiscount(obj[k].discount) + '</td>' +
          '<td>' + formatKH(obj[k].amount) + '</td>';

      }
      concate += '</tr>'

    });
    return concate;
  },
  itemDiscount: function (discount) {
    if (discount == undefined) {
      return '';
    } else {
      return discount;
    }
  }
});

var formatDollar = function (value) {
  return numeral(value).format('0,0.00');
}
var formatKH = function (value) {
  return numeral(value).format('0,0');
}
var itemName = function (id) {
  return Ice.Collection.Item.findOne(id).name;
}
var datePicker = function () {
  var date = $('[name="date"]');
  DateTimePicker.dateTimeRange(date);
};

var itemDiscount = function (discount) {
  if (discount == undefined) {
    return '';
  } else {
    return discount;
  }
}
