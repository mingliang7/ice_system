// Generated by CoffeeScript 1.4.0
var insertTpl = Template.iceContainer_insertTemplate;
var updateTpl = Template.iceContainer_updateTemplate;
Template.iceContainer_customer.onRendered(function () {
  return createNewAlertify(['iceContainerCustomer', 'container']);
});

Template.iceContainer_customer.events({
  'click .insert': function () {
    return alertify.iceContainerCustomer(fa("plus", "Customer"),
      renderTemplate(
        Template.iceContainer_insertTemplate)).maximize();
  },
  'click .update': function () {
    var customer;
    customer = IceContainer.Collection.Customer.findOne({
      _id: this._id
    });
    return alertify.iceContainerCustomer(fa("pencil", "Customer"),
      renderTemplate(
        Template.iceContainer_updateTemplate, customer)).maximize();
  },
  'click .remove': function () {
    var id;
    id = this._id;
    var flag = checkAvailable(id);
    if (flag) {
      return alertify.confirm(fa('remove', 'Remove customer'),
        "Are you sure to delete " + this.name + "?",
        function () {
          return iceContainer.Collection.Customer.remove(id, function (
            error) {
            if (error === 'undefined') {
              return alertify.error(error.message);
            }
            else {
              return alertify.warning('Successfully Remove');
            }
          });
        }, null);
    }
    else {
      alertify.warning('Customer Id #' + id + ' has orders');
    }
  },
  'click .show': function () {
    return alertify.iceContainerCustomer(fa('eye', 'Customer detail'),
      renderTemplate(
        Template.iceContainer_customerShowTemplate, this));
  },
  'dblclick tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    Session.set('IceContainerContainer_customer_id', rowData._id);
    Session.set('orderCustomerType', rowData.customerType);
    if (rowData.status == 'disable') {
      alertify.error('Sorry customer ' + rowData.name +
        ' is disabled ;(');
    }
    else {
      alertify.order(fa('eye', 'Order'), renderTemplate(Template.IceContainer_orderInsertTemplate,
          rowData))
        .maximize()
    }
  }
});

AutoForm.hooks({
  iceContainer_insertTemplate: {
    before: {
      insert: function (doc) {
        var prefix;
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(IceContainer.Collection.Customer,
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
  iceContainer_updateTemplate: {
    onSuccess: function (formType, result) {
      alertify.success('Successfully Updated');
      return alertify.customer().close();
    },
    onError: function (formType, error) {
      return alertify.error(error.message);
    }
  }
});


// var checkAvailable = function (id) {
//   var count = 0;
//   customer = iceContainer.Collection.Customer.findOne(id);
//   count = iceContainer.Collection.Order.find({
//     IceContainerCustomerId: id
//   }).count();
//   return count != 0 ? false : true;
// }
