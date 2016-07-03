Ice.Collection.Lending.before.insert(function (userId, doc) {
  var prefix = doc.branchId + '-L';
  var id = doc._id;
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Lending, prefix, 9);
  StateId.set('lending' + id, doc);
});

Ice.Collection.Lending.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(200);
    Container.updateContainer(doc, doc.containers, 'lending');
  });
});

Ice.Collection.Lending.before.update(function (userId, doc, fieldNames,
  modifier, options) {
  modifier.$set = modifier.$set || {};
  console.log(modifier.$set.containers);
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
Ice.Collection.Lending.after.update(function (userId, doc) {
  var preDoc = this.previous;
  var currentDoc = doc;
  Meteor.defer(function () {
    Meteor._sleepForMs(200);
    Container.freeContainer(preDoc._id, preDoc.containers);
    Container.updateContainer(currentDoc, currentDoc.containers,
      'lending')
  });

});

Ice.Collection.Lending.after.remove(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(200);
    Container.freeContainer(doc._id, doc.containers);
  });
});
