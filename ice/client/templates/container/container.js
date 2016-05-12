var indexTpl = Template.ice_container,
  insertTpl = Template.ice_insert,
  updateTpl = Template.ice_update,
  showTpl = Template.ice_showContainer;
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
  },
  'click .show': function () {
    alertify.alert(renderTemplate(showTpl, this).html);
  }
});

insertTpl.helpers({
  getCode: function () {
    return idGenerator.genWithPrefix(Ice.Collection.Container,
      'BP', 5, 'code');
  }
});
insertTpl.events({
  'keyup .quantity': function (
    event) {
    var currentValue = event.currentTarget.value;
    var qty = currentValue == '' ? 1 : parseInt(currentValue);
    var obj = Session.get('generateContainerQty');
    if (!_.isUndefined(obj)) {
      var price = (_.isUndefined(obj.price) || obj.price == 0) ?
        undefined : obj.price;
      var unit = (_.isUndefined(obj.unit) || obj.unit == '') ? undefined :
        obj.unit;
      var condition = (_.isUndefined(obj.condition) || obj.condition ==
          '') ?
        undefined : obj.condition;
      if (_.isUndefined(price) || _.isUndefined(unit) || _.isUndefined(
          condition)) {
        alertify.warning(
          'Please fill in Unit, Price and Condition, Date');
        $('.quantity').val('1');
      } else {
        var date = $('[name="importDate"]').val()
        obj.qty = qty;
        obj.date = date;
        obj.branchId = Session.get('currentBranch');
        Session.set('generateContainerQty', obj);
      }
    } else {
      alertify.warning(
        'Please fill in Unit, Price and Condition, Date');
      $('.quantity').val('1');
    }
  },
  'keyup [name="price"]': function (event) {
    var val = event.currentTarget.value;
    getVal = val == '' ? '0' : val;
    getObj('price', getVal);
  },
  'change [name="condition"]': function (event) {
    var val = event.currentTarget.value;
    if (val != '') {
      getObj('condition', val);
    }

  },
  'keyup [name="unit"]': function (event) {
    var val = event.currentTarget.value;
    getObj('unit', val)
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
        Meteor.call('generateQuantity', containerObj);
      }
      Session.set('generateContainerQty', undefined);
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  }
})



var getObj = function (field, val) {
  var getObj = Session.get('generateContainerQty');
  var obj = getObj == undefined ? {} : getObj;
  obj[field] = field == 'price' ? parseFloat(val) : val;
  console.log(obj);
  Session.set('generateContainerQty', obj);
  return;
}
