// Publication
Meteor.publish('sample_order', function () {
    if (this.userId) {
        return Sample.Collection.Order.find({}, {removed: true});
    }
});
