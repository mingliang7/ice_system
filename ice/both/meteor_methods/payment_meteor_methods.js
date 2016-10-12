Meteor.methods({
    paymentReport: function (params) {
        this.unblock();
        var self = params;
        var groupContent = [];
        var data = {
            title: {},
            header: {},
            content: [],
            groups: [],
            footer: {},
            sumGroupFooter: {
                dueAmount: 0,
                balanceAmount: 0,
                paidAmount: 0
            }
        };

        /********* Header ********/
        customerType = self.customerType == '' ? 'All' : self.customerType
        customer = self.customerId == '' ? 'All' : self.customerId
        staff = self.staffId == '' ? 'All' : self.staffId
        data.header = {
            staff: staff == 'All' ? staff : findStaff(self.staffId),
            customerType: customerType,
            customer: customer,
            date: self.date,
            exchange: formatEx(self.exchange)
        }
        /**********Title**************/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.enName,
            address: company.khAddress,
            telephone: company.telephone
        };
        /********** Content **********/
        var content = [];
        var selector = {};
        date = self.date.split(' To ');
        startDate = date[0];
        endDate = date[1];
        if (staff != 'All' && customerType == 'All' && customer == 'All') {
            selector = {
                staffId: self.staffId,
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            var getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                // Do something
                content.push(obj);
            });
        } else if (staff == 'All' && customerType == 'All' && customer == 'All') {
            selector = {
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            var getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                // Do something
                content.push(obj);
            });

        } else if (staff != 'All' && customerType != 'All' && customer == 'All') {
            selector = {
                staffId: self.staffId,
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            var getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                var order = Ice.Collection.Order.findOne({
                    _id: obj.orderId_orderGroupId,
                    '_customer.customerType': customerType
                });
                if (!_.isUndefined(order)) {
                    content.push(obj);
                }
            });

        } else if (staff == 'All' && customerType != 'All' && customer == 'All') {
            selector = {
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            var getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                var order = Ice.Collection.Order.findOne({
                    _id: obj.orderId_orderGroupId,
                    '_customer.customerType': customerType
                });
                if (!_.isUndefined(order)) {
                    content.push(obj);
                }
            });

        } else if (staff == 'All' && customerType != 'All' && customer != 'All') {
            selector = {
                customerId: self.customerId,
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
            var getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                // Do something
                content.push(obj);
            });
        } else {
            selector = {
                staffId: self.staffId,
                customerId: self.customerId,
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
            getOrder = Ice.Collection.Payment.find(selector);
            getOrder.forEach(function (obj) {
                // Do something
                content.push(obj);
            });
        }
        if (params.includeGroup) {
            var groupSelector = {
                paymentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
            var customerType = 'none';
            if (params.customerId) {
                groupSelector.customerId = params.customerId;
            }
            if (params.staffId) {
                groupSelector.staffId = params.staffId;
            }
            if(params.customerType) {
                customerType = params.customerType;
            }
            var groupPayment = Ice.Collection.ReceivePayment.aggregate([
                {$match: groupSelector},
                {
                    $lookup: {
                        from: 'ice_staffs',
                        localField: 'staffId',
                        foreignField: '_id',
                        as: 'staffDoc'
                    },
                },
                {
                    $lookup: {
                        from: 'ice_customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerDoc'
                    }
                },
                {
                    $unwind: {path: '$staffDoc', preserveNullAndEmptyArrays: true}
                },
                {
                    $unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}
                },
                {
                    $redact: {
                        $cond: {
                            if: {$or: [{$eq: ['$customerDoc.customerType', customerType]}, {$eq: [customerType, 'none']}]},
                            then: '$$KEEP', else: '$$PRUNE'
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $push: '$$ROOT'
                        },
                        dueAmount: {
                            $sum: '$dueAmount'
                        },
                        paidAmount: {
                            $sum: '$paidAmount'
                        },
                        balanceAmount: {
                            $sum: '$balanceAmount'
                        }
                    }
                }
            ]);
            groupContent = groupPayment[0].data;
            if(groupContent.length > 0) {
                data.sumGroupFooter.dueAmount = groupPayment[0].dueAmount;
                data.sumGroupFooter.paidAmount = groupPayment[0].paidAmount;
                data.sumGroupFooter.balanceAmount = groupPayment[0].balanceAmount;
            }
        }
        if (content.length > 0 || groupContent.length > 0) {
            var sortContent = content.sort(compare);
            var index = 1;
            sortContent.forEach(function (elm) {
                elm.index = index;
                index++;
            });
            data.content = sortContent;
            data.groups = groupContent;
            return data;
        } else {
            data.content.push({
                index: 'no results'
            });
            return data;
        }
    }
});


// methods
findStaff = function (id) {
    return Ice.Collection.Staffs.findOne(id).name;
};

sortItems = function (orderDetail) {
    td = ""
    listItem = {};
    items = Ice.Collection.Item.find()
    count = 0;
    items.forEach(function (item) {
        listItem[item._id] = item;
        listItem[item._id].qty = 0;
        listItem[item._id].amount = 0;

    });
    orderDetail.forEach(function (order) {
        listItem[order.iceItemId] = {
            qty: listItem[order.iceItemId].qty += order.qty,
            price: order.price,
            amount: listItem[order.iceItemId].amount += order.amount
        }
    });
    // display all items
    for (var k in listItem) {
        td += '<td>' + formatQty(listItem[k].qty) + '</td>' + '<td>' + formatKh(
                listItem[k].price) + '</td>' + '<td>' + formatKh(listItem[k].amount) +
            '</td>'
    }
    return td;
}

formatKh = function (val) {
    return numeral(val).format('0,0')
}
formatUS = function (val) {
    return numeral(val).format('0,0.00');
}
formatEx = function (id) {
    exchange = Cpanel.Collection.Exchange.findOne(id)
    return JSON.stringify(exchange.rates);
}

formatQty = function (val) {
    return numeral(val).format('0.0');
}
findCustomerByType = function (type) {
    arr = []
    customers = undefined;
    if (type != 'All') {
        customers = Ice.Collection.Customer.find({
            customerType: type
        })
    } else {
        customers = Ice.Collection.Customer.find()
    }
    customers.forEach(function (customer) {
        arr.push(customer._id);
    });
    return arr;
}
// sort function
function compare(a, b) {
    if (a._id < b._id)
        return -1;
    if (a._id > b._id)
        return 1;
    return 0;
}
