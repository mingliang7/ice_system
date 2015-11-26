Ice.Collection.Lending.before.insert(function (userId, doc) {
  var prefix = doc._id + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Container, prefix, 9);
});
