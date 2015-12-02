Ice.Collection.Lending.before.insert(function (userId, doc) {
  var prefix = doc._id + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Lending, prefix, 9);
});

Ice.Collection.Lending.after.insert(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1500);
    Container.updateContainer(doc, doc.containers, 'lending');
  });
});

Ice.Collection.Lending.after.update(function (userId, doc) {
  var preDoc = this.previous;
  var currentDoc = doc;
  Meteor.defer(function () {
    Meteor._sleepForMs(1000);
    Container.freeContainer(preDoc._id, preDoc.containers);
    Container.updateContainer(currentDoc, currentDoc.containers,
      'lending')
  });

});

Ice.Collection.Lending.after.remove(function (userId, doc) {
  Meteor.defer(function () {
    Meteor._sleepForMs(1000);
    Container.freeContainer(doc._id, doc.containers);
  });
});
