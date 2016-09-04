Ice.Collection.ReceivePayment.before.insert(function (userId, doc) {
    var prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Ice.Collection.ReceivePayment, prefix, 9);
    if (doc.balanceAmount > 0) {
        doc.status = 'partial';
    } else {
        doc.status = 'closed';
    }
});

Ice.Collection.ReceivePayment.after.insert(function (userId, doc) {
    if (doc.status == 'partial') {
        Ice.Collection.GroupInvoice.direct.update(doc.invoiceId, {$set: {status: 'partial'}});
    } else {
        Ice.Collection.GroupInvoice.direct.update(doc.invoiceId, {$set: {status: 'closed'}});
    }
});


Ice.Collection.ReceivePayment.after.update(function (userId, doc) {
    var preDoc = this.previous;
    var selector = {};
    if (doc.balanceAmount > 0) {
        Ice.Collection.ReceivePayment.direct.update(doc._id, {$set: {status: 'partial'}});
        selector.$set = {status: 'partial'};
        updateInvoiceGroup(doc.invoiceId, selector, Ice.Collection.GroupInvoice);

    } else if (doc.balanceAmount < 0) {
        Ice.Collection.ReceivePayment.direct.update(doc._id, {$set: {status: 'closed', paidAmount: doc.dueAmount, balanceAmount: 0}});
        selector.$set = {status: 'closed'};
        updateInvoiceGroup(doc.invoiceId, selector,  Ice.Collection.GroupInvoice);

    }
    else {
        Ice.Collection.ReceivePayment.direct.update(doc._id, {$set: {status: 'closed'}});
        selector.$set = {status: 'closed'};
        updateInvoiceGroup(doc.invoiceId, selector, Ice.Collection.GroupInvoice);
    }
});

function updateInvoiceGroup(_id, selector, collection) {
    collection.direct.update(_id, selector);
}