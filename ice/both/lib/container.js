Container = {
  //Available container after update
  freeContainer: function (propId, containers) {
    containers.forEach(function (container) {
      Ice.Collection.Container.update(container.containerId, {
        $set: {
          status: 'Available'
        },
        $pull: {
          transaction: {
            id: propId // can be lending or returning
          }
        }
      });
    });
  },
  updateContainer: function (doc, containers, type) {
    var obj = {};
    var status = type == 'lending' ? 'Unavailable' : 'Available';
    containers.forEach(function (container) {
      obj = {
        id: doc._id,
        date: doc[type + 'Date'],
        type: type,
        condition: container.condition
      }
      Ice.Collection.Container.update({
        _id: container.containerId
      }, {
        $set: {
          status: status
        },
        $push: {
          transaction: obj
        }
      })
    })
  },
  updateLending: function (doc, containers) {
    var selector = {}
    containers.forEach(function (container) {
      selector['containers.$.returnDate'] = doc.returningDate;
      selector['containers.$.returnCondition'] = container.condition
      if (container.returnMoney) {
        selector['containers.$.returnMoney'] = container.returnMoney
      }
      Ice.Collection.Lending.direct.update({
        _id: container.lendingId,
        containers: {
          $elemMatch: {
            containerId: container.containerId
          }
        }
      }, {
        $set: selector
      });
    })
  }

}
