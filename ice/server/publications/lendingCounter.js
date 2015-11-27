Meteor.publish('lending', function () {
  Counts.publish(this, 'lendingCounter', Ice.Collection.Lending.find({
    'containers.returnDate': {
      $exists: false
    }
  }));
});
