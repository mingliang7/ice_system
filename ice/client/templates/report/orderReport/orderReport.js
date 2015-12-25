// sort function
function compare(a, b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}

Template.ice_orderReport.onRendered(function () {
  datePicker();
  Meteor.typeahead.inject();
});

Template.ice_orderReport.events({
  'change [name="staffId"]': function (e) {
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('staffId', value);
  },
  'change [name="customerType"]': function (e) {
    value = $(e.currentTarget).val();
    $('[name="customerId"]').val('').change();
    $('.customer').val('');
    if (value != '') {
      $('.typeahead-customer').removeClass('hidden')
    } else {
      $('.typeahead-customer').addClass('hidden')
    }
    Ice.ListForReportState.set('customerType', value);
  },
  'change [name="date"]': function (e) {
    value = $('[name="date"]').val().split(' To ')
    Ice.ListForReportState.set('dateRange', value);
  },
  'keyup [name="date"]': function (e) {
    value = $('[name="date"]').val().split(' To ')
    Ice.ListForReportState.set('dateRange', value);
  },
  'keyup .customer': function (event) {
    if (event.currentTarget.value == '') {
      $('[name="customerId"]').val('')
    }
  },
  'click .customer': function () {
    $('.customer').select()
  }
});

Template.ice_orderReportInsertTemplate.helpers({
  search: function (query, sync, callback) {
    var type = Ice.ListForReportState.get('customerType');
    console.log(type);
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
      $('[name="customerId"]').val(suggestion._id)
    }
    if (suggestion._id == '') {
      $('[name="customerId"]').val('')
    }
  }
});
datePicker = function () {
  var date;
  date = $('[name="date"]');
  return DateTimePicker.dateTimeRange(date);
};

/***** Generate ******/
Template.ice_orderReportGen.helpers({
  data: function () {
    var self = this;
    var id = JSON.stringify(self);
    var data = Meteor.callAsync(id, 'orderReport', self);
    if (!data.ready()) {
      return false;
    }
    return data.result();
  },
  name: function (id) {
    customer = ReactiveMethod.call('getCustomer', id);
    return customer.name + ' (' + customer.customerType + ')'
  },
  staffName: function (id) {
    console.log(id);
    return Ice.Collection.Staffs.findOne(id).name;
  },
  itemDetail: function (orderDetail) {
    return sortItems(orderDetail);
  },
  check: function (value, total) {
    return value == undefined ? total : formatKh(value)
  },
  totalDiscount: function (content) {
    var discount = 0;
    content.forEach(function (item) {
      if (item.discount != undefined) {
        discount += item.discount;
      }
    });
    return '<td><strong>' + formatKh(discount) + '</strong></td>' +
      '<td></td><td></td>';
  },
  sumTotal: function (content) {
    td = ''
    total = 0;
    outstandingAmount = 0;
    paidAmount = 0
    content.forEach(function (item) {
      if (item.paidAmount == undefined) {
        paidAmount += 0
        outstandingAmount += item.total
        total += item.total
      } else {
        total += item.total
        paidAmount += item.paidAmount
        outstandingAmount += item.outstandingAmount
      }
    });
    return '<td>' + '<strong>' + formatKh(total) + '</strong' + '</td>' +
      '<td>' + '<strong>' + formatKh(paidAmount) + '</strong' + '</td>' +
      '<td>' + '<strong>' + formatKh(outstandingAmount) + '</strong>' +
      '</td>';
  },
  formatCurrency: function (value) {
    return formatKh(value);
  },
  totalInDollar: function (content) {
    td = ''
    total = 0;
    outstandingAmount = 0;
    paidAmount = 0
    content.forEach(function (item) {
      dollar = JSON.parse(formatEx(item.exchange)).USD;
      if (item.paidAmount == undefined) {
        paidAmount += 0
        outstandingAmount += (item.total * parseFloat(dollar))
        total += (item.total * parseFloat(dollar))
      } else {
        total += (item.total * parseFloat(dollar))
        paidAmount += (item.paidAmount * parseFloat(dollar))
        outstandingAmount += (item.outstandingAmount * parseFloat(
          dollar))
      }
    });
    return '<td>' + '<strong>' + formatUS(total) + '</strong>' + '</td>' +
      '<td>' + '<strong>' + formatUS(paidAmount) + '</strong>' + '</td>' +
      '<td>' + '<strong>' + formatUS(outstandingAmount) + '</td>';
  },
  sumQty: function (content) {
    td = '';
    listItem = {};
    items = Ice.Collection.Item.find()
    count = 0;
    items.forEach(function (item) {
      listItem[item._id] = item;
      listItem[item._id].qty = 0;
      listItem[item._id].amount = 0;

    });
    content.forEach(function (order) {
      order.iceOrderDetail.forEach(function (order) {
        listItem[order.iceItemId] = {
          qty: listItem[order.iceItemId].qty += order.qty
        }
      });
    });
    for (var k in listItem) {
      td += '<td colspan="3"><strong>' + listItem[k].qty +
        '</strong></td>';
    }
    return td;
  }
});

// methods
findStaff = function (id) {
  return Ice.Collection.Staffs.findOne(id).name;
}

sortItems = function (orderDetail) {
  td = ""
  listItem = {};
  items = Ice.Collection.Item.find()
  count = 0;
  items.forEach(function (item) {
    listItem[item._id] = item;
    listItem[item._id].qty = 0;
    listItem[item._id].amount = 0;

  });
  orderDetail.forEach(function (order) {
    listItem[order.iceItemId] = {
      qty: listItem[order.iceItemId].qty += order.qty,
      price: order.price,
      amount: listItem[order.iceItemId].amount += order.amount
    }
  });
  // display all items
  for (var k in listItem) {
    td += '<td>' + formatQty(listItem[k].qty) + '</td>' + '<td>' + formatKh(
        listItem[k].price) + '</td>' + '<td>' + formatKh(listItem[k].amount) +
      '</td>'
  }
  return td;
}

formatKh = function (val) {
  debugger
  return numeral(val).format('0,0')
}
formatUS = function (val) {
  return numeral(val).format('0,0.00');
}
formatEx = function (id) {
  exchange = Cpanel.Collection.Exchange.findOne(id)
  return exchange.base == 'KHR' ? JSON.stringify(exchange.rates) : '';
}

formatQty = function (val) {
  return numeral(val).format('0.0');
}
findCustomerByType = function (type) {
  arr = []
  customers = undefined;
  if (type != 'All') {
    customers = Ice.Collection.Customer.find({
      customerType: type
    })
  } else {
    customers = Ice.Collection.Customer.find()
  }
  customers.forEach(function (customer) {
    arr.push(customer._id);
  });
  return arr;
}
