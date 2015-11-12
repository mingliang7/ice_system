Meteor.publish('container', function () {
  Counts.publish(this, 'containerCounter', IceContainer.Collection.Container
    .find({
      status: 'Available'
    }));
});
