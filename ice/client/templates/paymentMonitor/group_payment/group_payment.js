// Generated by CoffeeScript 1.4.0
var findCustomer;

findCustomer = function(id) {
  var name, type, _ref;
  _ref = Ice.Collection.Customer.findOne(id), name = _ref.name, type = _ref.customerType;
  return {
    name: name,
    customerType: type
  };
};

Template.ice_paymentGroupMonitor.onRendered(function() {
  Session.set('invioceReportId', null)
  createNewAlertify(['groupSearch', 'paymentPopUP']);
  return Session.set('checked', false);
});

Template.ice_paymentGroupMonitor.helpers({
  checked: function() {
    return Session.get('checked');
  }
});

Template.ice_paymentGroupMonitor.events({
  'click .checkGroup': function(e) {
    var value;
    value = $(e.currentTarget).prop('checked');
    if (value === true) {
      return Session.set('checked', true);
    } else {
      return Session.set('checked', false);
    }
  }
});

Template.list_invoices.events({
  "click .i-print": function(e) {
    var doc, id, url;
    id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ');
    doc = Ice.Collection.OrderGroup.findOne(id[0]);
    url = "invoiceGroupReportGen?id=" + id[0] + "&customerId=" + doc.iceCustomerId + "&date=" + (moment(doc.startDate).format('YYYY-MM-DD hh:mm:ss a')) + "&endDate=" + (moment(doc.endDate).format('YYYY-MM-DD hh:mm:ss a'));
    return window.open(url, '_blank');
  },
  "click .p-print": function(e) {
    return alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this));
  }
});

Template.list_invoices.helpers({
  invoices: function() {
    var date, invoices, today;
    date = new Date().getDate() - 1;
    today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD');
    invoices = Ice.Collection.OrderGroup.find({
      endDate: today
    }, {limit: 20}).fetch();
    console.log(invoices);
    $.each(invoices, function(index, invoice) {
      return invoice.index = index;
    });
    return invoices;
  },
  type: function(id) {
    var customerType;
    customerType = findCustomer(id).customerType;
    return "" + customerType + " Days";
  },
  customerName: function(id) {
    var name;
    name = findCustomer(id).name;
    return " | Customer: " + name;
  },
  reportInfo: function(total, totalInDollar) {
    total = numeral(total).format('0,0.000');
    totalInDollar = numeral(totalInDollar).format('0,0.000');
    return "Total(R): " + total + " | Total($): " + totalInDollar;
  },
  isEven: function(index) {
    return index % 2 === 0;
  },
  format: function(createdAt) {
    return moment(createdAt).format('hh:mm a');
  },
  formatKH: function(value) {
    return numeral(value).format('0,0');
  }
});

Template.searchGroupResult.helpers({
  invoices: function() {
    var date, invoices, today;
    date = new Date().getDate() - 1;
    today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD');
    invoices = Ice.Collection.OrderGroup.find({
      endDate: today
    }).fetch();
    console.log(invoices);
    $.each(invoices, function(index, invoice) {
      return invoice.index = index;
    });
    return invoices;
  },
  type: function(id) {
    var customerType;
    customerType = findCustomer(id).customerType;
    return "" + customerType + " Days";
  },
  customerName: function(id) {
    var name;
    name = findCustomer(id).name;
    return " | Customer: " + name;
  },
  reportInfo: function(total, totalInDollar) {
    total = numeral(total).format('0,0');
    totalInDollar = numeral(totalInDollar).format('0,0.000');
    return "Total(R): " + total + " | Total($): " + totalInDollar;
  },
  isEven: function(id) {
    var index;
    index = id.slice(15);
    return parseInt(index - 1) % 2 === 0;
  },
  format: function(createdAt) {
    return moment(createdAt).format('hh:mm a');
  },
  formatKH: function(value) {
    return numeral(value).format('0,0');
  }
});

Template.searchGroupResult.events({
  "click .i-print": function(e) {
    var doc, id, url;
    id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ');
    doc = Ice.Collection.OrderGroup.findOne(id[0]);
    url = "invoiceGroupReportGen?id=" + id[0] + "&customerId=" + doc.iceCustomerId + "&date=" + (moment(doc.startDate).format('YYYY-MM-DD hh:mm:ss a')) + "&endDate=" + (moment(doc.endDate).format('YYYY-MM-DD hh:mm:ss a'));
    return window.open(url, '_blank');
  },
  "click .p-print": function(e) {
    return alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this));
  }
});

Template.filteredGroupPayment.events({
  'change .filter-group': function(e) {
    var instance, value;
    value = $(e.currentTarget).val();
    instance = EasySearch.getComponentInstance({
      index: 'ice_orderGroups'
    });
    EasySearch.changeProperty('ice_orderGroups', 'filteredGroupPayment', value);
    EasySearch.changeLimit('ice_orderGroups', 10);
    instance.paginate(1);
    return instance.triggerSearch();
  }
});

