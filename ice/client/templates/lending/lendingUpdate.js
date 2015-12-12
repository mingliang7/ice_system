var updateTpl = Template.ice_lendingUpdate;
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
Template.containerDropDownUpdate.helpers({
  selector: function () {
    return {
      status: 'Available'
    }
  }
});
Template.containerDropDownUpdate.events({
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

var launchModal = function (currentTarget) {
  Session.set('currentElemName', currentTarget.name)
  $('.containerDropDown').modal('show');
}


AutoForm.hooks({
  ice_lendingUpdate: {
    onSuccess: function (formType, result) {
      alertify.success('Successfully Update');
      Router.go('ice.lending');
    },
    onError: function (type, err) {
      alertify.error(err.message)
    }
  }
})
