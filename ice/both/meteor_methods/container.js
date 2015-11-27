Meteor.methods({
  findContainer: function (id) {
    return Ice.Collection.Container.findOne(id);
  }
});
