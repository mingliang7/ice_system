Ice.Collection.Lending.before.insert(function (userId, doc) {
  var prefix = doc._id + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Lending, prefix, 9);
});

Ice.Collection.Lending.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    var obj = {}
    doc.containers.forEach(function (container) {
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
  });
});
