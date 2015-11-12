Meteor.methods({
  generateCode: function () {
    return idGenerator.genWithPrefix(IceContainer.Collection.Container,
      'BP', 5, 'code');
  }
});
