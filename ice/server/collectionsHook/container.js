Ice.Collection.Container.before.insert(function (userId, doc) {
  doc._id = idGenerator.gen(Ice.Collection.Container, 5);
})
