Meteor.methods({
  getLendingDoc: function (id) {
    return Ice.Collection.Lending.findOne(id);
  },
  getLendingId: function (id) {
    var lending = StateId.get(id);
    return lending
  },
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
  listUpdateLendingByCustomerId: function (customerId) {
    var list = [];
    var flag = [];
    var lendings = Ice.Collection.Lending.find({
      customerId: customerId
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
          list.push({
            label: lending._id + ' | Date:' + lending.lendingDate,
            value: lending._id
          })
          break
        }
      });
    }
    return list;
  },
  listUpdateContainer: function (lendingId, returnId) {
    var list = [];
    var lending = Ice.Collection.Lending.findOne(lendingId);
    if (!_.isUndefined(lending)) {
      lending.containers.forEach(function (container) {
        var returnContainer = Ice.Collection.Returning.findOne({
          _id: {
            $ne: returnId
          },
          containers: {
            $elemMatch: {
              containerId: container.containerId,
              lendingId: lendingId
            }
          }
        })
        if (_.isUndefined(returnContainer)) // if no container available in other record
        {
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
