Template.ice_paymentReport.onRendered(function() {
  datePicker();
});

Template.ice_paymentReport.events({
  'change [name="staffId"]': function(e) {
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('staffId', value);
  },
  'change [name="customerType"]': function(e) {
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customerType', value);
  },
  'change [name="date"]': function(e) {
    value = $('[name="date"]').val().split(' To ');
    Ice.ListForReportState.set('dateRange', value);
  },
  'keyup [name="date"]': function(e) {
    value = $('[name="date"]').val().split(' To ');
    Ice.ListForReportState.set('dateRange', value);
  }
});
Template.ice_paymentReportInsertTemplate.helpers({
  customerOption: function() {
    type = Ice.ListForReportState.get('customerType');
    console.log(type);
    if (!_.isUndefined(type)) {
      return ReactiveMethod.call('customerByType', type);
    } else {
      return [{
        label: 'All',
        value: ''
      }];
    }
  }
});
datePicker = function() {
  var date;
  date = $('[name="date"]');
  return DateTimePicker.dateTimeRange(date);
};

/***** Generate ******/
Template.ice_paymentReportGen.helpers({
  data: function() {
    var self = this;
    var id = JSON.stringify(self);
    var payment = Meteor.callAsync(id, 'paymentReport', self);
    if (!payment.ready()) {
      return false;
    }
    return payment.result();
  },
  name: function(id) {
    customer = ReactiveMethod.call('getCustomer', id);
    return customer.name + ' (' + customer.customerType + ')';
  },
  itemDetail: function(orderDetail) {
    return sortItems(orderDetail);
  },
  check: function(value, total) {
    return value == undefined ? total : formatKh(value);
  },
  findName: function(id) {
    return Ice.Collection.Staffs.findOne(id).name;
  },
  sumTotal: function(content) {
    td = '';
    dueAmount = 0;
    outstandingAmount = 0;
    paidAmount = 0;
    content.forEach(function(item) {
      dueAmount += item.dueAmount;
      paidAmount += item.paidAmount;
      outstandingAmount += item.outstandingAmount;
    });
    return '<td>' + '<strong>' + formatKh(dueAmount) + '</strong' +
      '</td>' + '<td>' + '<strong>' + formatKh(paidAmount) + '</strong' +
      '</td>' + '<td>' + '<strong>' + formatKh(outstandingAmount) +
      '</strong>' + '</td>';
  },
  formatCurrency: function(value) {
    return formatKh(value);
  },
  totalInDollar: function(content) {
    td = '';
    dueAmount = 0;
    outstandingAmount = 0;
    paidAmount = 0;
    dollar = undefined;
    exchange = Cpanel.Collection.Exchange.find().fetch();
    currency = exchange[0].base == 'KHR' ? JSON.parse(formatEx(exchange[0]
      ._id)).USD : JSON.parse(formatEx(exchange[0]._id)).KHR;
    content.forEach(function(item) {
      dueAmount += (item.dueAmount * parseFloat(currency));
      paidAmount += (item.paidAmount * parseFloat(currency));
      outstandingAmount += (item.outstandingAmount * parseFloat(
        currency));
    });
    return '<td>' + '<strong>' + formatUS(dueAmount) + '</strong>' +
      '</td>' + '<td>' + '<strong>' + formatUS(paidAmount) + '</strong>' +
      '</td>' + '<td>' + '<strong>' + formatUS(outstandingAmount) +
      '</td>';
  }
});

// methods
findStaff = function(id) {
  return Ice.Collection.Staffs.findOne(id).name;
};

sortItems = function(orderDetail) {
  td = "";
  listItem = {};
  items = Ice.Collection.Item.find();
  count = 0;
  items.forEach(function(item) {
    listItem[item._id] = item;
    listItem[item._id].qty = 0;
    listItem[item._id].amount = 0;

  });
  orderDetail.forEach(function(order) {
    listItem[order.iceItemId] = {
      qty: listItem[order.iceItemId].qty += order.qty,
      price: order.price,
      amount: listItem[order.iceItemId].amount += order.amount
    };
  });
  // display all items
  for (var k in listItem) {
    td += '<td>' + formatQty(listItem[k].qty) + '</td>' + '<td>' + formatKh(
        listItem[k].price) + '</td>' + '<td>' + formatKh(listItem[k].amount) +
      '</td>';
  }
  return td;
};

formatKh = function(val) {
  return numeral(val).format('0,0');
};
formatUS = function(val) {
  return numeral(val).format('0,0.00');
};
formatEx = function(id) {
  exchange = Cpanel.Collection.Exchange.findOne(id);
  return JSON.stringify(exchange.rates);
};

formatQty = function(val) {
  return numeral(val).format('0.0');
};
findCustomerByType = function(type) {
  arr = [];
  customers = undefined;
  if (type != 'All') {
    customers = Ice.Collection.Customer.find({
      customerType: type
    });
  } else {
    customers = Ice.Collection.Customer.find();
  }
  customers.forEach(function(customer) {
    arr.push(customer._id);
  });
  return arr;
};
