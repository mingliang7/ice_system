var indexTpl = Template.ice_lending,
  insertTpl = Template.ice_lendingInsert,
  updateTpl = Template.ice_lendingUpdate,
  showTpl = Template.ice_lendingShow;
indexTpl.onRendered(function () {
  createNewAlertify('lending');
});

indexTpl.events({
  "click .insert": function () {
    alertify.lending(fa('plus', 'New Container'), renderTemplate(
      insertTpl)).maximize();
  }
});
insertTpl.onRendered(function () {
  datePicker();
});
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
insertTpl.events({
  'click .fake': function (event) {
    Session.set('currentElemName', event.currentTarget.name)
    $('[name="' + event.currentTarget.name + '"]').val('');
    $('.containerDropDown').modal();
  }
});
Template.containerDropDown.helpers({
  selector: function () {
    return {
      status: 'Available'
    }
  }
});
Template.containerDropDown.events({
  'click tbody > tr': function (event) {
    var dataTable = $(event.target).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget).data();
    var elemName = Session.get('currentElemName');
    var arr = [];
    $('.ice-container').each(function (position, obj) {
      arr.push(obj.value);
    })
    var validateContainer = !_.contains(arr, rowData._id)
    if (validateContainer) {
      $('input[name="' + elemName + '"]').val(rowData._id);
      $('select[name="' + elemName.replace('containerId', 'condition') +
        '"]').val(rowData.condition);
      $('.fake[name="' + elemName + '"]').val(rowData._id +
        ' | Price: ' +
        rowData.price + ' | Condition: ' +
        rowData
        .condition + ' | Status: ' + rowData.status);

      $('.containerDropDown').modal('hide');
      Session.set('currentElemName', undefined)
    } else {
      alertify.warning('Container ID Dupplicated, Please choose other!')
    }
  }

});

//datepicker
var datePicker = function () {
    lendingDate = $('[name="lendingDate"]');
    return DateTimePicker.dateTime(lendingDate);
  }
  // autoform hooks

AutoForm.hooks({
  ice_lendingInsert: {
    before: {
      insert: function (doc) {
        doc._id = Session.get('currentBranch');
        debugger
        return doc;
      }
    },
    onSuccess: function (type, result) {
      alertify.success('Successfully Insert')
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  }
})
