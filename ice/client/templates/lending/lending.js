var indexTpl = Template.ice_lending,
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
        Router.go('ice.lendingUpdate', {
          id: lendingId
        });
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
  },
  'click .print': function () {
    var id = this._id;
    if (this.lendingType == 'longTerm') {
      url = "/ice/lendingContractReportGen/" + id;
      window.open(url, '_blank');
    }
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
