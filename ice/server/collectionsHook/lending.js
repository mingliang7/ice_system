Ice.Collection.Lending.before.insert(function (userId, doc) {
  var prefix = doc._id + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Lending, prefix, 9);
});

Ice.Collection.Lending.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    updateContainer(doc, doc.containers);
  });
});

Ice.Collection.Lending.after.update(function (userId, doc) {
  var preDoc = this.previous;
  var currentDoc = doc;
  Meteor.defer(function () {
    Meteor._sleepForMs(1000);
    freeContainer(preDoc._id, preDoc.containers);
    updateContainer(currentDoc, currentDoc.containers)
  });

});

Ice.Collection.Lending.after.remove(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1000);
    freeContainer(doc._id, doc.containers);
  });
});

//Available container after update
freeContainer = function (lendingId, containers) {
  containers.forEach(function (container) {
    Ice.Collection.Container.update(container.containerId, {
      $set: {
        status: 'Available'
      },
      $pull: {
        transaction: {
          id: lendingId
        }
      }
    });
  });
}

updateContainer = function (doc, containers) {
  var obj = {};
  containers.forEach(function (container) {
    obj = {
      id: doc._id,
      date: doc.lendingDate,
      type: 'lending',
      condition: container.condition
    }
    Ice.Collection.Container.update({
      _id: container.containerId
    }, {
      $set: {
        status: 'Unavailable'
      },
      $push: {
        transaction: obj
      }
    })
  })
}
