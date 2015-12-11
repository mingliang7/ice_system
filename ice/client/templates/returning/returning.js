var indexTpl = Template.ice_returning,
  insertTpl = Template.ice_returningInsert,
  updateTpl = Template.ice_returningUpdate,
  showTpl = Template.ice_returningShow;
var state = new ReactiveObj();
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

insertTpl.onRendered(function () {
  datePicker();
});

updateTpl.onRendered(function () {
  datePicker();
  var index = 0;
  //set state foreach conainer
  state.set('returnId', this.data._id);
  debugger
  this.data.containers.forEach(function (container) {
    state.set('containers.' + index + '.condition', container.lendingId);
    index++;
  });
});

indexTpl.onRendered(function () {
  createNewAlertify('returning')
});

indexTpl.events({
  'click .update': function () {
    var data = this;
    alertify.returning(fa('pencil', 'Edit Returning'), renderTemplate(
      updateTpl, data)).maximize();
  },
  'click .remove': function () {
    var returningId = this._id;
    alertify.confirm(
      fa("remove", "Returning"),
      "Are you sure to delete [" + returningId + "]?",
      function () {
        Ice.Collection.Returning.remove(returningId, function (
          error) {
          if (error) {
            alertify.warning(error.message);
          } else {
            alertify.success("Successfully removed!");
          }
        });
      },
      null
    );
  }
});

Template.customObjectReturningField.helpers({
  listLending: function () {
    var customerId, listLending;
    if (this.formId == 'ice_returningUpdate') {
      customerId = $('[name="customerId"]').val();
      listLending = ReactiveMethod.call('listUpdateLendingByCustomerId',
        customerId);
      return listLending;
    } else {
      customerId = Session.get('ice_customer_id');
      listLending = ReactiveMethod.call('listLendingByCustomerId',
        customerId);
      return listLending;
    }
  },
  listContainer: function () {
    var condition = this.current.condition;
    var lendingId = state.get(condition);
    var returnId = state.get('returnId');
    if (this.formId == 'ice_returningUpdate') {
      listLendingUpdate = ReactiveMethod.call('listUpdateContainer',
        lendingId, returnId);
      return listLendingUpdate;
    } else {
      listLending = ReactiveMethod.call('listContainer', lendingId);
      return _.unique(listLending)
    }
  },
  checkForm: function (formId) {
    console.log(formId);
    if (formId == 'ice_returningUpdate') {
      return true;
    } else {
      return false;
    }
  }
});

Template.customObjectReturningField.events({
  'change .lendingId': function (event) {
    var condition = event.currentTarget.name.replace('lendingId',
      'condition');
    try {
      state.set(condition, $(event.currentTarget).val())
    } catch (e) {

    }
  },
  'change .containerId': function (event) {
    var currentValue = event.currentTarget.value;
    var currentReturnMoney = event.currentTarget.name.replace(
      'containerId', 'returnMoney');
    var arr = [];
    $('[name="' + event.currentTarget.name + '"]').val('') //set current selected value to ''
    $('.containerId').each(function (position, obj) {
      arr.push(obj.value);
    })
    var validateContainer = !_.contains(arr, currentValue); // if not contain selected value
    if (validateContainer) {
      $('[name="' + event.currentTarget.name + '"]').val(currentValue) //set current selected value
      var currentElemName = event.currentTarget.name.replace(
        'containerId',
        'condition');
      var condition = $('[name="' + event.currentTarget.name +
        '"] option:selected').text();
      $('select[name="' + currentElemName + '"]').val(condition.split(' ')[
        3]);
      $('[name="' + currentReturnMoney + '"]').attr('readonly', true);
    } else {
      $('[name="' + event.currentTarget.name + '"]').val('');
      alertify.warning('Container ID dupplicated. Please choose other!');
    }
  },
  'change .condition': function (event) {
    var currentValue = event.currentTarget.value;
    var currentReturnMoney = event.currentTarget.name.replace('condition',
      'returnMoney');
    if (currentValue == 'broken') {
      $('[name="' + currentReturnMoney + '"]').attr('readonly', false);
    } else {
      $('[name="' + currentReturnMoney + '"]').attr('readonly', true);
    }
  }
});
var datePicker = function () {
  returningDate = $('[name="returningDate"]');
  return DateTimePicker.dateTime(returningDate);
}
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
      alertify.returning().close();
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
