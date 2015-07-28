var findCustomer;

findCustomer = function(id) {
  var name, type, _ref;
  _ref = Ice.Collection.Customer.findOne(id), name = _ref.name, type = _ref.customerType;
  return {
    name: name,
    customerType: type
  };
};

Template.ice_paymentGeneralMonitor.onRendered(function() {
  createNewAlertify(['searchBox', 'paymentPopUP']);
  return Session.set('checked', false);
});

Template.ice_paymentGeneralMonitor.helpers({
  checked: function() {
    return Session.get('checked');
  }
});

Template.ice_paymentGeneralMonitor.events({
  'click .checkAll': function(e) {
    var value;
    value = $(e.currentTarget).prop('checked');
    if (value === true) {
      return Session.set('checked', true);
    } else {
      return Session.set('checked', false);
    }
  }
});

Template.general_invoices.events({
  "click .i-print": function(e) {
    var id;
    id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ');
    return GenReport(id[0]);
  },
  "click .p-print": function(e) {
    return alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this));
  }
});

Template.general_invoices.helpers({
  invoices: function() {
    var invoices, today;
    today = moment(new Date()).format('YYYY-MM-DD');
    invoices = Ice.Collection.Order.find({
      closing: false
    }, {
      sort: {
        orderDate: -1
      }
    }).fetch();
    $.each(invoices, function(index, invoice) {
      return invoice.index = index;
    });
    return invoices;
  },
  type: function(id) {
    var customerType;
    return customerType = findCustomer(id).customerType;
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

Template.searchResult.helpers({
  invoices: function() {
    var invoices, today;
    today = moment(new Date()).format('YYYY-MM-DD');
    invoices = Ice.Collection.Order.find({
      closing: false
    }, {
      sort: {
        orderDate: -1
      }
    }).fetch();
    console.log(invoices);
    $.each(invoices, function(index, invoice) {
      return invoice.index = index;
    });
    return invoices;
  },
  type: function(id) {
    var customerType;
    return customerType = findCustomer(id).customerType;
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

Template.searchResult.events({
  "click .i-print": function(e) {
    var id;
    id = $(e.currentTarget).parents('.order-info').find('.order-id').text().split(' | ');
    return GenReport(id[0]);
  },
  "click .p-print": function(e) {
    return alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, this));
  }
});

Template.filteredPayment.events({
  'change .filter': function(e) {
    var instance, value;
    value = $(e.currentTarget).val();
    instance = EasySearch.getComponentInstance({
      index: 'ice_orders'
    });
    EasySearch.changeProperty('ice_orders', 'filteredPayment', value);
    EasySearch.changeLimit('ice_orders', 10);
    instance.paginate(1);
    return instance.triggerSearch();
  }
});

Template.ice_paymentUrlInsertTemplate.events({ // on change for payment popup
  'click .close': function() {
    window.close()
  },
  'change [name="customerId"]': function(e) {
    var customer;
    customer = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customer', customer);
  },
  'change [name="orderId_orderGroupId"]': function(e) {
    var currentInvoice, currentInvoiceId, type;
    currentInvoiceId = $(e.currentTarget).val();
    datePicker(currentInvoiceId);
    type = Ice.ListForReportState.get('type');
    if (type === 'general') {
      currentInvoice = Ice.Collection.Order.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else {
      currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    }
  },
  'keyup [name="paidAmount"]': function() {
    var dueAmount, paidAmount;
    dueAmount = parseInt($('[name="dueAmount"]').val());
    paidAmount = $('[name="paidAmount"]').val();
    if (parseInt(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      return $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      return $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});