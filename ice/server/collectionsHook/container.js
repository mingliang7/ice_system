Ice.Collection.Container.before.insert(function (userId, doc) {
  var prefix = doc.branchId + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Container, prefix, 5);
})
