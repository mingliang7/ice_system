// Publication
Meteor.publish('sample_customer', function () {
    if (this.userId) {
        return Sample.Collection.Customer.find({}, {removed: true});
    }
});
