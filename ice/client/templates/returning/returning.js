var indexTpl = Template.ice_returning,
  insertTpl = Template.ice_returningInsert,
  updateTpl = Template.ice_returningUpdate,
  showTpl = Template.ice_returningShow;
insertTpl.helpers({
  customerId: function () {
    return Session.get('ice_customer_id');
  },
  customerName: function () {
    var customerId = Session.get('ice_customer_id');
    var name = ReactiveMethod.call('getCustomerName', customerId);
    return name;
  }
});

Template.customObjectReturningField.helpers({
  listLending: function () {
    var customerId = Session.get('ice_customer_id');
    var listLending = ReactiveMethod.call('listLendingByCustomerId',
      customerId);
    console.log(listLending)
    return listLending;
  },
  listContainer: function () {
    var lendingId = Session.get('lendingId');
    return ReactiveMethod.call('listContainer', lendingId);
  }
});

Template.customObjectReturningField.events({
  'change .lendingId': function (event) {
    try {
      Session.set('lendingId', $(event.currentTarget).val())
    } catch (e) {

    }
  },
  'change .containerId': function (event) {
    var currentElemName = event.currentTarget.name.replace('containerId',
      'condition');
    var condition = $('[name="' + event.currentTarget.name +
      '"] option:selected').text();
    $('select[name="' + currentElemName + '"]').val(condition.split(' ')[
      3]);
  }
});
AutoForm.hooks({
  ice_returningInsert: {
    before: {
      insert: function (doc) {
        doc._id = Session.get('currentBranch');
        return doc;
      }
    },
    onSuccess: function (type, result) {
      alertify.success('Successfully Insert')
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  },
  ice_returningUpdate: {
    onSuccess: function (formType, result) {
      alertify.success('Successfully Update');
      alertify.returning().close();
    },
    onError: function (type, err) {
      alertify.error(err.message)
    }
  }
})
