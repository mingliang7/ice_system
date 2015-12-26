Session.setDefault('customer', '');

Template.ice_paymentInsertTemplate.onRendered(function () {
  return createNewAlertify(['staffAddOn', 'invoiceAddOn', 'customerAddOn']);
});
Template.ice_payment.onRendered(function () {
  return createNewAlertify(['paymentForm', 'staffAddOn', 'invoiceAddOn',
    'customerAddOn'
  ]);
});

Template.ice_payment.helpers({
  foo: function () {
    var self;
    if (this !== null) {
      self = this;
      Session.set(customer, findCustomer(self.customerId));
    }
    Session.get('customer');
  }
});

Template.ice_payment.events({
  'click .insert': function () {
    Session.set('checkIfUpdate', false);
    Router.go('ice.ice_paymentInsertTemplate');
  },
  'click .remove': function () {
    Meteor.call('checkAvailablityPayment', this, function (err, result) {
      var flag = '';
      result.payments.forEach(function (payment) {
        flag = (result.currentPayment >= payment.paymentDate) ?
          true :
          false;
      });
      flag ? onRemoved(result.doc) : alertify.warning(
        'Sorry! invoice ' + result.id +
        ' is not a last record :( ');
    });
  },
  'click .show': function () {
    alertify.paymentForm(fa('eye', 'Payment'), renderTemplate(Template.ice_paymentShowTemplate,
      this));
  },
  'click .update': function () {
    Meteor.call('checkAvailablityPayment', this, function (
      err, result) {
      var flag = '';
      result.payments.forEach(function (payment) {
        flag = (result.currentPayment >= payment.paymentDate) ?
          true :
          false;
      });
      var id = result.id;
      if (flag) {
        Session.set('checkIfUpdate', true);
        Router.go('ice.ice_paymentUpdate', {
          id: id
        });
        Session.set('paymentFlag', undefined);
      } else {
        alertify.warning('Sorry! invoice ' + id +
          ' is not a last record :( ');
      }
    });
  }
});
var insertTpl = Template.ice_paymentInsertTemplate
insertTpl.onRendered(function () {
  Meteor.typeahead.inject();
})
insertTpl.events({
  'keyup .customer': function (event) {
    if (event.currentTarget.value == '') {
      $('[name="customerId"]').val('')
      $('[name="orderId_orderGroupId"]').attr('disabled', true);
      $('[name="orderId_orderGroupId"]').val('');
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
      $('[name="customerId"]').val(suggestion._id)
      $('[name="orderId_orderGroupId"]').attr('disabled', false);
      Session.set('customer', suggestion._id);
    }
    if (suggestion._id == '') {
      $('[name="orderId_orderGroupId"]').attr('disabled', true);
      $('[name="customerId"]').val('')
    }
  }
})
Template.ice_paymentInsertTemplate.events({
  'click .customerAddOn': function () {
    alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(
      Template.ice_insertTemplate));
  },
  'click .invoiceAddOn': function () {
    alertify.invoiceAddOn(fa('shopping-cart', 'Order'), renderTemplate(
      Template.ice_orderInsertTemplate)).maximize();
  },
  'click .staffAddOn': function () {
    alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate));
  },
  'change [name="orderId_orderGroupId"]': function (e) {
    var currentInvoice, currentInvoiceId, type;
    currentInvoiceId = $(e.currentTarget).val();
    datePicker(currentInvoiceId);
    type = Ice.ListForReportState.get('type');

    if (type === 'general') {
      Meteor.call('orderId', currentInvoiceId, function (err,
        currentInvoice) {
        $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
        $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
        $('[name="outstandingAmount"]').val(0);
      });
    } else {
      Meteor.call('orderGroupId', currentInvoiceId, function (err,
        currentInvoice) {
        $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
        $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
        $('[name="outstandingAmount"]').val(0);
      });
    }
  },
  'keyup [name="paidAmount"]': function () {
    var dueAmount, paidAmount;
    try {
      paidAmount = $('[name="paidAmount"]').val();
    } catch (e) {
      console.log(e);
    }
    dueAmount = parseInt($('[name="dueAmount"]').val());
    if (parseInt(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});
Template.ice_paymentUpdateTemplate.events({
  'keyup [name="paidAmount"]': function () {
    dueAmount = $('[name="dueAmount"]').val();
    paidAmount = $('[name="paidAmount"]').val();
    dueAmount = parseFloat(dueAmount);
    paidAmount = parseFloat(paidAmount);
    outstandingAmount = dueAmount - paidAmount;
    console.log(paidAmount);
    if (paidAmount > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      $('[name="outstandingAmount"]').val(0);
    } else {
      $('[name="outstandingAmount"]').val(outstandingAmount);
    }
  }
});
Template.ice_paymentInsertTemplate.helpers({
  invoiceOption: function () {
    if (Session.get('customer')) {
      invoice = ReactiveMethod.call('invoice', false, Session.get(
        'customer'));
      Ice.ListForReportState.set('type', invoice.type);
      return invoice.list;
    }
  }
});
Template.ice_paymentUpdateTemplate.helpers({
  getCustomer: function (id) {
    if (!_.isUndefined(id)) {
      return ReactiveMethod.call('getCustomerName', id);
    }
  }
});
Template.ice_paymentShowTemplate.helpers({
  format: function (value) {
    return numeral(value).format('0,0');
  },
  customer: function (id) {
    var name = Ice.Collection.Customer.findOne(id).name;
    return id + '(' + name + ')';
  }
});

//functions
var findCustomer = function (id) {
  var name;
  name = Ice.Collection.Customer.findOne(id).name;
  return name;
};


var removeDoc = function (doc) {
  var doc = doc;
  alertify.confirm((fa('remove'), 'Remove Payment'), 'Are you sure to remove' +
    doc._id + '?',
    function () {
      Ice.Collection.Payment.remove(doc._id, function (error) {
        checkType(doc);
        alertify.message('Successfully remove');
      });
    }, null);

};

var checkType = function (doc) {
  Meteor.call("getCustomerType", doc, function (err, result) {
    if (result.type == 'general') {
      removeOrderPayment(result.data);
    } else {
      removeOrderGroupPayment(result.data);
    }
  });
};

var checkAvailablity = function (doc) {

};
//remove payment and update order
var onRemoved = function (doc) {
  removeDoc(doc);
};



var removeOrderPayment = function (doc) {
  Meteor.call('removeOrderPayment', doc);
};

var removeOrderGroupPayment = function (doc) {
  Meteor.call('removeOrderGroupPayment', doc);
};

var datePicker = function (currentInvoiceId) {
  Meteor.call('payment', currentInvoiceId, function (err, payments) {
    maxDate = '';
    if (payments != undefined) {
      payments.forEach(function (payment) {
        maxDate = maxDate > payment.paymentDate ? maxDate : payment.paymentDate
      });
      maxDate;
    }
    var paymentDate = $('[name="paymentDate"]');
    console.log(maxDate);
    return DateTimePicker.dateTime(paymentDate);
    // setTimeout(function () {
    //   return maxDate == '' ? DateTimePicker.dateTime(paymentDate) :
    //     paymentDate.data('DateTimePicker').minDate(maxDate);
    // }, 2000);
  });
};
