Ice.Collection.Returning.before.insert(function (userId, doc) {
  var prefix = doc._id + '-R';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Returning, prefix, 9);
});

Ice.Collection.Returning.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    Container.updateContainer(doc, doc.containers, 'returning');
    Container.updateLending(doc, doc.containers)
  });
})
Ice.Collection.Returning.before.update(function (userId, doc, modifier,
  fieldNames,
  options) {
  modifier.$set = modifier.$set || {};
  if (modifier.$set.containers) {
    var containers = [];
    _.each(modifier.$set.containers, function (obj) {
      if (!_.isNull(obj)) {
        containers.push(obj);
      }
    });
    modifier.$set.containers = containers;
  }
});
Ice.Collection.Returning.after.update(function (userId, doc) {
  var preDoc = this.previous;
  var currentDoc = doc;
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    Container.freeContainer(preDoc._id, preDoc.containers);
    Container.updateContainer(doc, doc.containers, 'returning');
    Container.updateLending(doc, doc.containers, preDoc);
  });
});

Ice.Collection.Returning.after.remove(function (userId, doc) {
  var removedDoc = doc;
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    Container.unfreeContainer(removedDoc._id, removedDoc.containers);
    Container.unsetReturningContainer(removedDoc);
  });
});
