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

  }
});

insertTpl.helpers({
  getCode: function () {
    return idGenerator.genWithPrefix(Ice.Collection.Container,
      'BP', 5, 'code');
  }
});

indexTpl.onDestroyed(function () {
  Session.set('Unavailable', undefined);
  Session.set('Broken', undefined);
});
// autoform hooks

AutoForm.hooks({
  ice_insert: {
    before: {
      insert: function (doc) {
        doc.transaction = [];
        return doc;
      }
    },
    onSuccess: function (type, result) {
      Session.set("code", true);
      alertify.success('Successfully Insert')
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  }
})
