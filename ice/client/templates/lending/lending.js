var indexTpl = Template.ice_lending,
  insertTpl = Template.ice_lendingInsert,
  updateTpl = Template.ice_lendingUpdate,
  showTpl = Template.ice_lendingShow;
indexTpl.onRendered(function () {
  createNewAlertify('lending');
});
var state = new ReactiveObj();
indexTpl.events({
  "click .insert": function () {
    alertify.lending(fa('plus', 'New Lending'), renderTemplate(
      insertTpl)).maximize();
  },
  "click .update": function (event) {
    var lendingId = this._id;
    var doc = this;
    var obj = {}
    var index = 0;
    doc.containers.forEach(function (container) {
      obj['containers.' + index + '.containerId'] = container.containerId
      index++;
    });
    state.set('containers', obj) //set container obj;
    Meteor.call("checkReturn", lendingId, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        alertify.warning('#' + lendingId + ' has return!')
      } else {
        alertify.lending(fa('pencil', 'Update Lending'),
          renderTemplate(updateTpl, doc)).maximize();
      }
    });
  },
  'click .remove': function (event) {
    var lendingId = this._id;
    var doc = this;
    Meteor.call("checkReturn", lendingId, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        alertify.warning('#' + lendingId + ' has return!')
      } else {
        alertify.confirm(
          fa("remove", "Lending"),
          "Are you sure to delete [" + lendingId + "]?",
          function () {
            Ice.Collection.Lending.remove(lendingId, function (
              error) {
              if (error) {
                alertify.warning(error.message);
              } else {
                alertify.success("Success removed!");
              }
            });
          },
          null
        );
      }
    });
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
    launchModal(event.currentTarget)
  }
});
updateTpl.helpers({
  customerName: function () {
    return (this.customerId + ' | ' + this._customer.name);
  }
});
updateTpl.events({
  'click .fake': function (event) {
    launchModal(event.currentTarget)
  }
});
Template.customObjectLendingField.helpers({
  check: function (formId) {
    if (formId == 'ice_lendingUpdate') {
      return true;
    } else {
      return false;
    }
  },
  currentName: function (name) {
    var containerObj = state.get('containers') //get containers obj
    var container = ReactiveMethod.call('findContainer', containerObj[
      name]);
    return container._id + ' | Price: ' + container.price +
      ' | Condition: ' + container.condition;
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
var launchModal = function (currentTarget) {
  Session.set('currentElemName', currentTarget.name)
  $('.containerDropDown').modal('show');
}
AutoForm.hooks({
  ice_lendingInsert: {
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
  ice_lendingUpdate: {
    onSuccess: function (formType, result) {
      alertify.success('Successfully Update');
      alertify.lending().close();
    },
    onError: function (type, err) {
      alertify.error(err.message)
    }
  }
})
