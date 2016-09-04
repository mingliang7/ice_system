Meteor.methods({
    getActiveGroupInvoice: function (customerId) {
        var list = [];
        var groupInvoice = Ice.Collection.GroupInvoice.find({
            customerId: customerId,
            status: {$in: ['active', 'partial']}
        });
        if(groupInvoice.count() > 0) {
            groupInvoice.forEach(function (doc) {
                var date = moment(doc.startDate).format('YYYY-MM-DD') + '-' + moment(doc.endDate).format('YYYY-MM-DD');
                list.push({label: doc._id + ' | ' + date, value: doc._id});
            });
        }
        return list;
    },
    removedReceivePayment: function(doc){
        console.log(doc);
        var payments = Ice.Collection.ReceivePayment.find({invoiceId: doc.invoiceId});
        var selector = {$set: {status: 'active'}};
        if (payments.count() == 1) {
            Ice.Collection.GroupInvoice.direct.update(doc.invoiceId, selector)
        } else {
            Ice.Collection.ReceivePayment.update({
                invoiceId: doc.invoiceId,
                _id: {$ne: doc._id},
                $or: [
                    {paymentDate: {$gt: doc.paymentDate}},
                    {dueAmount: {$lt: doc.dueAmount}}
                ]
            }, {
                $inc: {dueAmount: doc.paidAmount, balanceAmount: doc.paidAmount},
                $set: {status: 'partial'}
            }, {multi: true});
            selector.$set.status = 'partial';
            Ice.Collection.GroupInvoice.direct.update(doc.invoiceId, selector);
        }
        Ice.Collection.ReceivePayment.remove({_id: doc._id});
    }
});