IceContainer.Collection.Container.before.insert(function (userId, doc) {
  doc._id = idGenerator.gen(IceContainer.Collection.Container, 5);
})
