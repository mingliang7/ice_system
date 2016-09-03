Ice.Collection.Order.before.insert(function(userId, doc) {
    var id = doc._id;
    var prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
    StateId.set(id + '', doc._id);
    StateId.set(doc._id, doc);
});
Ice.Collection.Order.after.insert(function(userId, doc) {
    Meteor.defer(function() {
        var type = Ice.Collection.Customer.findOne(doc.iceCustomerId).customerType;
        if (type != 'general') {
            Meteor.call('generateInvoiceGroup', doc, type);
        }
    });
});
Ice.Collection.Order.before.update(function(userId, doc, fieldNames, modifier,
    options) {
    modifier.$set = modifier.$set || {};
    if (modifier.$set.iceOrderDetail) {
        var iceOrderDetail = [];
        _.each(modifier.$set.iceOrderDetail, function(obj) {
            if (!_.isNull(obj)) {
                iceOrderDetail.push(obj);
            }
        });
        modifier.$set.iceOrderDetail = iceOrderDetail;
    }
});
Ice.Collection.Order.after.update(function(userId, doc) {
    var preDoc = this.previous;
    Meteor.defer(function() {
        var type = Ice.Collection.Customer.findOne(doc.iceCustomerId).customerType;
        if (type != 'general') {
            removeInvoiceFromGroup(preDoc);
            pushInvoiceFromGroup(doc);
            recalculatePayment(preDoc, doc);
        }
    });
});
Ice.Collection.Order.after.remove(function(userId, doc) {
    removeInvoiceFromGroup(doc);
    var groupInvoice = Ice.Collection.GroupInvoice.findOne(doc.iceOrderGroupId);
    if (groupInvoice.invoices.length <= 0) {
        Ice.Collection.GroupInvoice.direct.remove(doc.iceOrderGroupId);
    }
    else {
        recalculatePaymentAfterRemoved(doc);
    }
});

function removeInvoiceFromGroup(doc) {
    Meteor._sleepForMs(200);
    Ice.Collection.GroupInvoice.update({
        _id: doc.iceOrderGroupId
    }, {
        $pull: {
            invoices: {
                _id: doc._id
            }
        },
        $inc: {
            total: -doc.total
        }
    });
}

function pushInvoiceFromGroup(doc) {
    Meteor._sleepForMs(200);
    Ice.Collection.GroupInvoice.update({
        _id: doc.iceOrderGroupId
    }, {
        $addToSet: {
            invoices: doc
        },
        $inc: {
            total: doc.total
        }
    });
}

function recalculatePayment(preDoc,doc) {
    var totalChanged = doc.total - preDoc.total;
    if (totalChanged != 0) {
        var invoiceId = doc.iceOrderGroupId || doc._id
        var receivePayment = Ice.Collection.ReceivePayment.find({invoiceId: invoiceId});
        if (receivePayment.count() > 0) {
            Ice.Collection.ReceivePayment.update({invoiceId: invoiceId}, {
                $inc: {
                    dueAmount: totalChanged,
                    balanceAmount: totalChanged
                }
            }, {multi: true});
            Ice.Collection.ReceivePayment.direct.remove({invoiceId: invoiceId, dueAmount: {$lte: 0}});
        }
    }
}

function recalculatePaymentAfterRemoved(doc) {
    var totalChanged = -doc.total;
    if (totalChanged != 0) {
        var invoiceId = doc.iceOrderGroupId;
        var receivePayment = Ice.Collection.ReceivePayment.find({invoiceId: invoiceId});
        if (receivePayment.count() > 0) {
            Ice.Collection.ReceivePayment.update({invoiceId: invoiceId}, {
                $inc: {
                    dueAmount: totalChanged,
                    balanceAmount: totalChanged
                }
            }, {multi: true});
            Ice.Collection.ReceivePayment.direct.remove({invoiceId: invoiceId, dueAmount: {$lte: 0}});
        }
    }
}