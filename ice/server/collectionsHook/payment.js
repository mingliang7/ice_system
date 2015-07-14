Ice.Collection.Payment.before.insert(function (userId, doc) {
    
    if (doc.outstandingAmount != 0) {
        doc.status = "Partial";
    } else {
        doc.status = "Close";
    }s
});

Ice.Collection.Payment.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};

    if (modifier.$set.outstandingAmount != 0) {
        modifier.$set.status = "Partial";
    } else {
        modifier.$set.status = "Close";
    }
});
