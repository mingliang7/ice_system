Meteor.methods({
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
    var lendings = Ice.Collection.Lending.find({
      customerId: customerId,
      'containers.returnDate': {
        $exists: false
      }
    }).fetch();
    if (lendings.length > 0) {
      lendings.forEach(function (lending) {
        list.push({
          label: lending._id + ' | Date:' + lending.lendingDate,
          value: lending._id
        })
      });
    }
    return list;
  },
  listContainer: function (lendingId) {
    console.log(lendingId);
    var list = [];
    var lending = Ice.Collection.Lending.findOne(lendingId);
    if (!_.isUndefined(lending)) {
      lending.containers.forEach(function (container) {
        list.push({
          label: container.containerId + ' | condition: ' +
            container.condition,
          value: container.containerId
        });
      });
    }
    return list;
  }
});
