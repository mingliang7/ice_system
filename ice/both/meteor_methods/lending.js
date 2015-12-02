Meteor.methods({
  getLending: function (id) {
    return Ice.Collection.Lending.findOne(id);
  },
  checkReturn: function (id) {
    var flag, returnDate;
    returnDate = Ice.Collection.Lending.findOne({
      _id: id,
      'containers.returnDate': {
        $exists: true
      }
    })
    flag = _.isUndefined(returnDate) ? false : true;
    return flag;
  },
  listLendingByCustomerId: function (customerId) {
    var list = [];
    var flag = [];
    var lendings = Ice.Collection.Lending.find({
      customerId: customerId
    }).fetch();
    if (lendings.length > 0) {
      lendings.forEach(function (lending) {
        for (var i = 0; i < lending.containers.length; i++) {
          if (_.isUndefined(lending.containers[i].returnDate)) {
            list.push({
              label: lending._id + ' | Date:' + lending.lendingDate,
              value: lending._id
            })
            break
          }
        }
      });
    }
    console.log(list);
    return list;
  },
  listContainer: function (lendingId) {
    console.log(lendingId);
    var list = [];
    var lending = Ice.Collection.Lending.findOne(lendingId);
    if (!_.isUndefined(lending)) {
      lending.containers.forEach(function (container) {
        if (!container.returnDate) {
          list.push({
            label: container.containerId + ' | condition: ' +
              container.condition,
            value: container.containerId
          });

        }
      });
    }
    return list;
  }
});
