Ice.Collection.Returning.before.insert(function (userId, doc) {
  var prefix = doc._id + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Returning, prefix, 9);
});

Ice.Collection.Returning.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    Container.updateContainer(doc, doc.containers, 'returning');
    Container.updateLending(doc, doc.containers)
  });
})