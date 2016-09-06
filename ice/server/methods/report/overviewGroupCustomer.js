Meteor.methods({
    overviewGroupCustomer: function (params) {
        var self = params;
        var data = {
            title: {},
            header: {},
            content: [],
            footer: {}
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.enName
        };

        /********* Header ********/
        data.header = self;
        date = moment(self.date).toDate();
        var selector = {
            status: {
                $in: ['active', 'partial']
            },
            endDate: {
                $lt: date
            }
        };
        var invoices = Ice.Collection.GroupInvoice.aggregate([
            { $match: selector },
            {
                $lookup: {
                    from: "ice_receivePayment",
                    localField: "_id",
                    foreignField: "invoiceId",
                    as: "paymentDoc"
                }
            },
            { $unwind: { path: '$paymentDoc', preserveNullAndEmptyArrays: true } },
            { $sort: { 'paymentDoc.paymentDate': 1 } },
            { $match: { $or: [{ "paymentDoc.paymentDate": { $lt: moment(date).format('YYYY-MM-DD 00:00:00') } }, { paymentDoc: { $exists: false } }] } },

            {
                $group: {
                    _id: '$_id',
                    status: { $last: '$status' },
                    invoiceDoc: { $last: '$$ROOT' },
                    lastPaymentDate: { $last: '$paymentDoc.paymentDate' },
                    dueAmount: {
                        $last: '$total'
                    },
                    paidAmount: {
                        $sum: '$paymentDoc.paidAmount'
                    },
                    paymentDoc: { $last: '$paymentDoc' },
                    total: { $last: '$total' },
                    startDate: {$last: '$startDate'},
                    endDate: { $last: '$endDate' }
                }
            },
            {
                $project: {
                    _id: 1,
                    invoice: { $concat: 'Group' },
                    invoiceDoc: {
                        customerId: 1,
                        startDate: 1,
                        endDate: 1
                    },
                    dueAmount: 1,
                    paidAmount: {
                        $ifNull: ["$paidAmount", 0]
                    },
                    balance: {
                        $subtract: ["$dueAmount", "$paidAmount"]
                    },
                    endDate: 1,
                    startDate: 1,
                    lastPaymentDate: {
                        $ifNull: ["$paymentDoc.paymentDate", "None"]
                    },
                    status: 1,
                    total: '$total'
                }
            },
            {
                $redact: {
                    $cond: { if: { $eq: ['$balance', 0] }, then: '$$PRUNE', else: '$$KEEP' }
                }
            },
            {
                $group: {
                    _id: '$invoiceDoc.customerId',
                    data: {
                        $addToSet: '$$ROOT'
                    },
                    startDate: { $last: '$startDate' },
                    endDate: { $last: '$endDate' },
                    lastPaymentDate: { $last: '$lastPaymentDate' },
                    dueAmountSubTotal: { $sum: '$dueAmount' },
                    paidAmount: { $sum: '$paidAmount' },
                    balance: { $sum: '$balance' }
                }
            },
            {
                $lookup: {
                    from: "ice_customers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            },
            {
                $unwind: { path: '$customerDoc', preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $addToSet: '$$ROOT'
                    }
                }
            }
        ]);
        if (invoices.length > 0) {
            data.content = invoices[0].data;
            // data.footer = {
            //     total: invoices[0].total,
            //     totalKhr: invoices[0].totalKhr,
            //     totalThb: invoices[0].totalThb
            // }
        }
        return data;
    }
});