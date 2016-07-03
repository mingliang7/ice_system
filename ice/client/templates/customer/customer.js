// Generated by CoffeeScript 1.4.0
Template.ice_customer.onRendered(function () {
  return createNewAlertify(['customer', 'order', 'lending', 'returning']);
});
Template.ice_customer.events({
  'click .insert': function () {
    return alertify.customer(fa("plus", "Customer"), renderTemplate(
      Template.ice_insertTemplate)).maximize();
  },
  'click .update': function () {
    var customer;
    customer = Ice.Collection.Customer.findOne({
      _id: this._id
    });
    return alertify.customer(fa("pencil", "Customer"), renderTemplate(
      Template.ice_updateTemplate, customer)).maximize();
  },
  'click .remove': function () {
    var id;
    id = this._id;
    var flag = checkAvailable(id);
    if (flag) {
      return alertify.confirm(fa('remove', 'Remove customer'),
        "Are you sure to delete " + this.name + "?",
        function () {
          return Ice.Collection.Customer.remove(id, function (error) {
            if (error == 'undefined') {
              return alertify.error(error.message);
            } else {
              return alertify.warning('Successfully Remove');
            }
          });
        }, null);
    } else {
      alertify.warning('Customer Id #' + id + ' has orders');
    }
  },
  'click .show': function () {
    return alertify.customer(fa('eye', 'Customer detail'), renderTemplate(
      Template.ice_customerShowTemplate, this));
  },
  'dblclick tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    Session.set('ice_customer_id', rowData._id);
    Session.set('orderCustomerType', rowData.customerType);
    if (rowData.status == 'disable') {
      alertify.error('Sorry customer ' + rowData.name +
        ' is disabled ;(');
    } else {
      alertify.order(fa('eye', 'Order'), renderTemplate(Template.ice_orderInsertTemplate,
          rowData))
        .maximize()
    }
  },
  'click tbody > tr, .lending-count': function (event) {
    if (event.ctrlKey || $(event.target).hasClass('lending-count')) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      Session.set('ice_customer_id', rowData._id);
      Router.go('ice.lendingInsert', {
        customerId: rowData._id
      });
    }
  },
  'click tbody > tr, .returning-count': function (event) {
    if (event.shiftKey || $(event.target).hasClass('returning-count')) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      Session.set('ice_customer_id', rowData._id);
      alertify.returning(fa('plus', 'New Returning'), renderTemplate(
        Template
        .ice_returningInsert)).maximize();
    }
  }
});
Template.ice_insertTemplate.events({
  'click .check-info': function (event) {
    if ($(event.currentTarget).prop('checked')) {
      $('.additional-info').removeClass('hidden', 500);
    } else {
      $('.additional-info').addClass('hidden', 500);
    }
  }
})
Template.ice_updateTemplate.events({
  'click .check-info': function (event) {
    if ($(event.currentTarget).prop('checked')) {
      $('.additional-info').removeClass('hidden', 500);
    } else {
      $('.additional-info').addClass('hidden', 500);
    }
  }
})
AutoForm.hooks({
  insertTemplate: {
    before: {
      insert: function (doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Customer,
          prefix, 6);
        doc.branchId = Session.get('currentBranch');
        return doc;
      }
    },
    onSuccess: function (formType, result) {
      $('select').each(function () {
        $(this).select2('val', '');
      });
      return alertify.success('Successfully created');
    },
    onError: function (formType, error) {
      return alertify.error(error.message);
    }
  },
  updateTemplate: {
    onSuccess: function (formType, result) {
      alertify.success('Successfully Updated');
      return alertify.customer().close();
    },
    onError: function (formType, error) {
      return alertify.error(error.message);
    }
  }
});


var checkAvailable = function (id) {
  var count = 0;
  customer = Ice.Collection.Customer.findOne(id);
  if (customer.customerType == 'general') {
    count = Ice.Collection.Order.find({
      iceCustomerId: id
    }).count();
  } else {
    count = Ice.Collection.OrderGroup.find({
      iceCustomerId: id
    }).count();
  }
  return count != 0 ? false : true;
}
