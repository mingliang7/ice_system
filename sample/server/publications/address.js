// Publication
Meteor.publish('sample_address', function () {
    if (this.userId) {
        return Sample.Collection.Address.find({}, {removed: true});
    }
});
