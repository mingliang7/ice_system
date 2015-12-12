var indexTpl = Template.ice_container,
  insertTpl = Template.ice_insert,
  updateTpl = Template.ice_update,
  showTpl = Template.ice_show;
indexTpl.onRendered(function () {
  Session.set('Available', 'Available');
  // Session.set('Broken', 'Unavailable');
  // Session.set('Broken', 'Broken');
  createNewAlertify('container');
});

Template.ice_containerTabular.helpers({
  selector: function () {
    var obj = {};
    var available = Session.get('Available');
    var unAvailable = Session.get('Unavailable');
    var broken = Session.get('Broken');
    var statusArray = [];
    if (available)
      statusArray.push(available);
    if (unAvailable)
      statusArray.push(unAvailable)
    if (broken)
      statusArray.push(broken)
    obj.status = {
      $in: statusArray
    }
    console.log(obj);
    return obj;

  }
})
insertTpl.onRendered(function () {
  datePicker();
});
updateTpl.onRendered(function () {
  datePicker();
});
Template.ice_containerTabular.helpers({
  containerSelector: {

  }
});
indexTpl.events({
  'change [name="available"]': function (
    event) {
    var current = $(event.currentTarget)
    if (current.prop('checked')) {
      var value = current.val();
      Session.set(value, value);
    } else {
      Session.set('Available', undefined);
    }
  },
  'change [name="unavailable"]': function (event) {
    var current = $(event.currentTarget)
    if (current.prop('checked')) {
      var value = current.val();
      Session.set(value, value);
    } else {
      Session.set('Unavailable', undefined);
    }
  },
  'change [name="broken"]': function (event) {
    var current = $(event.currentTarget)
    if (current.prop('checked')) {
      var value = current.val();
      Session.set(value, value);
    } else {
      Session.set('Broken', undefined);
    }
  },
  "click .insert": function () {
    alertify.container(fa('plus', 'New Container'), renderTemplate(
      insertTpl));

  },
  'click .update': function () {
    var doc = this;
    Meteor.call("findContainerInLending", doc._id, function (error,
      result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        alertify.warning('Sorry container #' + doc._id +
          ' has lending!');
      } else {
        alertify.container(fa('plus', 'Edit Container'),
          renderTemplate(updateTpl, doc));
      }
    });
  },
  'click .remove': function () {
    var id = this._id;
    Meteor.call("findContainerInLending", id, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        alertify.warning('Sorry container #' + id +
          ' has lending!');
      } else {
        alertify.confirm(
          fa("remove", "Container"),
          "Are you sure to delete [" + id + "]?",
          function () {
            Ice.Collection.Container.remove(id, function (
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

insertTpl.helpers({
  getCode: function () {
    return idGenerator.genWithPrefix(Ice.Collection.Container,
      'BP', 5, 'code');
  }
});
insertTpl.events({
  'keyup .quantity': function (event) {
    var obj = {};
    obj.qty = parseInt($(event.currentTarget).val());
    unit = $("[name='unit']").val();
    price = $("[name='price']").val();
    date = $('[name=importDate]').val();
    obj.condition = $('[name="condition"]').val()
    obj.branchId = Session.get('currentBranch');
    if (unit == '' || price == '' || obj.condition == '' || date == '') {
      alertify.warning('Please fill in Unit, Price and Condition, Date');
      $('.quantity').val('1');
    } else {
      obj.price = parseInt(price);
      obj.unit = parseInt(unit);
      obj.date = date;
      Session.set('generateContainerQty', obj);
    }
  }
});
indexTpl.onDestroyed(function () {
  Session.set('Unavailable', undefined);
  Session.set('Broken', undefined);
});
// autoform hooks
var datePicker = function () {
    importDate = $('[name="importDate"]');
    return DateTimePicker.dateTime(importDate);
  }
  //datepicker
AutoForm.hooks({
  ice_insert: {
    before: {
      insert: function (doc) {
        doc.transaction = [];
        doc.branchId = Session.get('currentBranch');
        return doc;
      }
    },
    onSuccess: function (type, result) {
      alertify.success('Successfully Insert')
      var containerObj = Session.get('generateContainerQty')
      if (!_.isUndefined(containerObj)) {
        debugger
        Meteor.call('generateQuantity', containerObj);
      }
      Session.set('generateContainerQty', undefined);
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  }
})
