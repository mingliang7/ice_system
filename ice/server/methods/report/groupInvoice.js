Meteor.methods({
    groupInvoiceReport: function (params) {
        this.unblock();
        var self = params;
        var data = {
            title: {},
            header: {},
            content: [],
            displayFields: [],
            footer: {}
        };
        /********* Header ********/
        customerType = self.customerType == '' ? 'All' : self.customerType;
        customer = self.customerId == '' ? 'All' : self.customerId;
        status = self.status == '' ? 'All' : self.status;
        data.header = {
            date: self.date,
            customerType: customerType,
            customer: customer
        };
        /********** Company**********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.khName,
            address: company.khAddress,
            telephone: company.telephone
        };
        /********** Display Fields ********/
        var items = Ice.Collection.Item.find({}, {name: 1});
        items.forEach(function (item) {
            data.displayFields.push({field: item.name.split('ទឹកកក')[1], itemId: item._id});
        });
        /********** Content **********/

        var content = [];
        var selector = {};
        if (self.customerType != '' && self.customerId == '') {
            var arr = [];
            var customers = Ice.Collection.Customer.find({customerType: self.customerType}, {_id: 1});
            customers.forEach(function (customer) {
                arr.push(customer._id);
            });
            selector.customerId = {$in: arr}
        }
        if (self.status != '') {
            selector.status = self.status == 'unPaid' ? {$in: ['partial', 'active']} : self.status;
        }
        if (self.customerId != '') {
            selector.customerId = self.customerId;
        }
        date = self.date.split(' To ');
        startDate = moment(date[0]).toDate();
        endDate = moment(date[1]).toDate();
        selector.startDate = {
            $gte: startDate
        };
        selector.endDate = {
            $lte: endDate
        };
        content = Ice.Collection.GroupInvoice.aggregate([
            {$match: selector},
            {$unwind: {path: '$invoices'}},
            {$unwind: {path: '$invoices.iceOrderDetail'}},
            {
                $lookup: {
                    from: "ice_items",
                    localField: "invoices.iceOrderDetail.iceItemId",
                    foreignField: "_id",
                    as: "itemDoc"
                }
            },
            {$unwind: {path: '$itemDoc'}},
            {
                $group: {
                    startDate: {$last: '$startDate'},
                    endDate: {$last: '$endDate'},
                    _id: {
                        invoiceId: '$_id',
                        invoiceDate: {
                            day: {$dayOfMonth: "$invoices.orderDate"},
                            month: {$month: "$invoices.orderDate"},
                            year: {$year: '$invoices.orderDate'}
                        },
                        itemId: '$invoices.iceOrderDetail.iceItemId'
                    },
                    customerId: {$last: '$customerId'},
                    orderDate: {$last: '$invoices.orderDate'},
                    itemName: {$last: '$itemDoc.name'},
                    itemId: {$last: '$invoices.iceOrderDetail.iceItemId'},
                    sumQty: {
                        $sum: '$invoices.iceOrderDetail.qty'
                    },
                    avgPrice: {
                        $avg: '$invoices.iceOrderDetail.price'
                    },
                    amount: {
                        $sum: '$invoices.iceOrderDetail.amount'
                    }
                }
            },
            {$sort: {itemName: -1}},
            {
                $project: {
                    _id: 1,
                    startDate: 1,
                    endDate: 1,
                    itemName: 1,
                    itemId: 1,
                    avgPrice: 1,
                    sumQty: 1,
                    amount: 1,
                    customerId: 1,
                    orderDate: {$dateToString: {format: "%Y-%m-%d", date: "$orderDate"}}
                }
            },
            {
                $group: {
                    _id: {
                        invoiceId: '$_id.invoiceId',
                        invoiceDate: {
                            day: '$_id.invoiceDate.day',
                            month: '$_id.invoiceDate.month',
                            year: '$_id.invoiceDate.year'
                        }
                    },
                    customerId: {$last: '$customerId'},
                    startDate: {$last: '$startDate'},
                    endDate: {$last: '$endDate'},
                    orderDate: {$last: '$orderDate'},
                    itemDoc: {
                        $addToSet: {
                            itemId: '$itemId',
                            itemName: '$itemName',
                            avgPrice: {$avg: {$sum: '$avgPrice'}},
                            sumQty: {$sum: '$sumQty'},
                            sumAmount: {$sum: '$amount'}
                        }
                    },
                    total: {$sum: '$amount'}
                }
            },
            {$sort: {orderDate: -1}},
            {
                $group: {
                    _id: '$_id.invoiceId',
                    customerId: {$last: '$customerId'},
                    startDate: {$last: '$startDate'},
                    endDate: {$last: '$endDate'},
                    groupByDate: {
                        $addToSet: {
                            orderDate: '$orderDate',
                            itemDoc: '$itemDoc'
                        }
                    },
                    total: {
                        $sum: '$total'
                    }

                }
            }, {
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
                    customerId: {$last: '$customerId'},
                    startDate: {$last: '$startDate'},
                    endDate: {$last: '$endDate'},
                    groupByDate: {$last: '$groupByDate'},
                    dueAmount: {
                        $last: '$paymentDoc.balanceAmount'
                    },
                    paidAmount: {
                        $sum: '$paymentDoc.paidAmount'
                    },
                    total: {$last: '$total'},
                }
            },
            {
                $lookup: {
                    from: "ice_customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    _id: 1,
                    customerId: 1,
                    startDate: 1,
                    customerDoc: 1,
                    endDate: 1,
                    groupByDate: 1,
                    balance: {
                        $subtract: ['$total', {$ifNull: ["$paidAmount", 0]}]
                    },
                    paidAmount: {
                        $ifNull: ["$paidAmount", 0]
                    },
                    dueAmount: '$total'
                }
            },
            {$sort: {_id: 1}}
        ]);
        if (content.length > 0) {
            content.forEach(function (order) {
                order.header = [{
                    col1: '#: ' + order._id,
                    col2: 'អតិថិជន: ' + order.customerDoc.name
                }, {
                    col1: 'កាលបរិច្ឆេទ: ' + moment(order.startDate).format('YYYY-MM-DD') + " ដល់ " + moment(order.endDate).format('YYYY-MM-DD'),
                    col2: 'ប្រភេទ: ' + order.customerDoc.customerType
                }];
                order.footer = sumItems({_id: order._id})[0].itemsDoc;
            });
            data.content = content;
            return data;
        } else {
            data.content.push({
                index: 'no results'
            });
            return data;
        }
    }

});


function sumItems(matchId) {
    var items = Ice.Collection.GroupInvoice.aggregate([
        {$match: matchId},
        {
            $unwind: {path: '$invoices', preserveNullAndEmptyArrays: true}

        },
        {$unwind: {path: '$invoices.iceOrderDetail'}},
        {
            $lookup: {
                from: "ice_items",
                localField: "invoices.iceOrderDetail.iceItemId",
                foreignField: "_id",
                as: "itemDoc"
            }
        },
        {$unwind: {path: '$itemDoc'}},
        {
            $group: {
                _id: {
                    invoiceId: '$_id',
                    itemId: '$invoices.iceOrderDetail.iceItemId'
                },
                itemName: {
                    $last: '$itemDoc.name'
                },
                itemId: {
                    $last: '$invoices.iceOrderDetail.iceItemId'
                },
                totalQty: {
                    $sum: '$invoices.iceOrderDetail.qty'
                },
                avgPrice: {
                    $avg: '$invoices.iceOrderDetail.price'
                },
                totalAmount: {
                    $sum: '$invoices.iceOrderDetail.amount'
                }
            }
        },
        {$sort: {itemName: -1}},
        {
            $group: {
                _id: '$_id.invoiceId',
                itemsDoc: {
                    $addToSet: {
                        itemName: '$itemName',
                        itemId: '$itemId',
                        totalQty: '$totalQty',
                        avgPrice: '$avgPrice',
                        totalAmount: '$totalAmount'
                    }
                }
            }

        },
        {$sort: {_id: 1}},
    ]);
    return items;
}