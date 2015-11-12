var indexTpl = Template.iceContainer_container,
  insertTpl = Template.iceContainer_insert,
  updateTpl = Template.iceContainer_update,
  showTpl = Template.iceContainer_show;
indexTpl.onRendered(function () {
  Session.set('Available', 'Available');
  createNewAlertify('container');
});

Template.iceContainer_containerTabular.helpers({
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
    return idGenerator.genWithPrefix(IceContainer.Collection.Container,
      'BP', 5, 'code');
  }
});


// autoform hooks

AutoForm.hooks({
  iceContainer_insert: {
    onSuccess: function (type, result) {
      Session.set("code", true);
      alertify.success('Successfully Insert')
    },
    onError: function (type, err) {
      alertify.error(err.message);
    }
  }
})
