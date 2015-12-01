Meteor.methods({
  findContainer: function (id) {
    return Ice.Collection.Container.findOne(id);
  },
  generateQuantity: function (containerObj) {
    Meteor.defer(function () {
      Meteor._sleepForMs(1000);
      var obj = {};
      for (var i = 0; i < containerObj.qty - 1; i++) {
        obj = {
          price: containerObj.price,
          unit: containerObj.unit,
          condition: containerObj.condition,
          transaction: [],
          branchId: containerObj.branchId
        }
        Ice.Collection.Container.insert(obj)
      }
    });
  },
  findContainerInLending: function (containerId) {
    var flag;
    container = Ice.Collection.Lending.findOne({
      'containers.containerId': containerId
    });
    flag = _.isUndefined(container) ? false : true
    return flag;
  }
});
