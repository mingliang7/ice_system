Container = {
  //Available container after update
  unfreeContainer: function (propId, containers) {
    containerTransaction(propId, containers, 'false');
  },
  freeContainer: function (propId, containers) {
    containerTransaction(propId, containers, 'true')
  },
  updateContainer: function (doc, containers, type) {
    var obj = {};
    var status = type == 'lending' ? 'Unavailable' : 'Available';
    containers.forEach(function (container) {
      status = container.condition == 'broken' ? 'Broken' : status
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
  updateLending: function (doc, containers, preDoc) {
    var selector = {}
    if (!_.isUndefined(preDoc)) {
      unsetReturning(preDoc);
    }
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
  },
  unsetReturningContainer: function (doc) {
    unsetReturning(doc);
  }
}

var unsetReturning = function (preDoc) {
  var selector = {}
  preDoc.containers.forEach(function (container) {
    selector['containers.$.returnDate'] = '';
    selector['containers.$.returnCondition'] = '';
    if (container.returnMoney) {
      selector['containers.$.returnMoney'] = ''
    }
    Ice.Collection.Lending.direct.update({
      _id: container.lendingId,
      containers: {
        $elemMatch: {
          containerId: container.containerId
        }
      }
    }, {
      $unset: selector
    });
  });
}


var containerTransaction = function (propId, containers, free) {
  var status = free == 'true' ? 'Available' : 'Unavailable';
  containers.forEach(function (container) {
    Ice.Collection.Container.update(container.containerId, {
      $set: {
        status: status
      },
      $pull: {
        transaction: {
          id: propId // can be lending or returning
        }
      }
    });
  });
}
