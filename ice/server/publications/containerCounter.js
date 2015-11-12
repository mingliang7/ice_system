Meteor.publish('container', function () {
  Counts.publish(this, 'containerCounter', Ice.Collection.Container
    .find({
      status: 'Available'
    }));
});
