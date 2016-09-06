Meteor.methods({
    getGroupInvoiceBalance: function (invoiceId) {
        var invoice = Ice.Collection.GroupInvoice.aggregate([
            {$match: {_id: invoiceId}},
            {
                $lookup: {
                    from: "ice_receivePayment",
                    localField: "_id",
                    foreignField: "invoiceId",
                    as: "paymentDoc"
                }
            },
            {$unwind: {path: '$paymentDoc', preserveNullAndEmptyArrays: true}},
            {$sort: {'paymentDoc._id': 1}},
            {
                $group: {
                    _id: '$_id',
                    status: {$last: '$status'},
                    invoiceDoc: {$last: '$$ROOT'},
                    lastPaymentDate: {$last: '$paymentDoc.paymentDate'},
                    dueAmount: {
                        $last: '$paymentDoc.balanceAmount'
                    },
                    paidAmount: {
                        $last: '$paymentDoc.paidAmount'
                    },
                    paymentDoc: {$last: '$paymentDoc'},
                    total: {$last: '$total'},
                    invoiceDate: {$last: '$invoiceDate'}
                }
            },
            {
                $project: {
                    _id: 1,
                    invoice: {$concat: 'Invoice'},
                    invoiceDoc: {
                        customerId: 1,
                        invoiceDate: 1
                    },
                    dueAmount: {
                        $ifNull: ["$dueAmount", "$total"]
                    },
                    paidAmount: {
                        $ifNull: ["$paidAmount", 0]
                    },
                    invoiceDate: 1,
                    lastPaymentDate: {
                        $ifNull: ["$paymentDoc.paymentDate", "None"]
                    },
                    status: 1,
                    total: '$total'
                }
            },
        ]);
        invoice[0].paidAmount = invoice[0].dueAmount;
        invoice[0].balanceAmount = invoice[0].dueAmount - invoice[0].paidAmount;
        return invoice[0];
    },
    removeGroupInvoice: function (doc) {
        if (doc.status == 'partial' || doc.status == 'closed') {
            Ice.Collection.ReceivePayment.remove({invoiceId: doc._id});
        }
        Ice.Collection.Order.direct.remove({iceOrderGroupId: doc._id});
        Ice.Collection.GroupInvoice.remove(doc._id);
    },
    updateNameInGroupInvoice: function (doc) {
        Meteor.defer(function () {
            var customer = Ice.Collection.Customer.findOne(doc.customerId);
            if (customer.name != doc.customerName) {
                Ice.Collection.GroupInvoice.direct.update(doc._id, {$set: {customerName: customer.name}});
            }
        });
    }
});