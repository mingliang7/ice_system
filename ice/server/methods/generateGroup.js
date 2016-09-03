Meteor.methods({
    generateInvoiceGroup: function(doc, type) {
        var range = getRank(doc.orderDate, type);
        insertGroupInvoice(
            Ice.Collection.Order,
            range,
            doc,
            Ice.Collection.GroupInvoice
        );
    }
});

getRank = function(date, type) {
    obj = {};
    var day, now, range;
    range = undefined;
    day = new Date(date).getDate();
    now = new Date(date);
    range = 31;
    startDate = '';
    endDate = '';
    onFeb = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (var i = 1; i <= range; i += type) {
        for (var j = i; j < i + type; j++) {
            if (day <= j) {
                if (now.getMonth() + 1 == 2) {
                    if (j + type >= onFeb) {
                        endDate = moment(now.setDate(onFeb)).format('YYYY-MM-DD');
                        break;
                    } else {
                        endDate = moment(now.setDate((i + type) - 1)).format('YYYY-MM-DD');
                        break;
                    }

                } else {
                    if (i + type > 40) {
                        lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        endDate = moment(lastDate).format('YYYY-MM-DD');
                        break;
                    } else if (i + type > 30) {
                        lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        endDate = moment(lastDate).format('YYYY-MM-DD');
                        break;
                    } else {
                        endDate = moment(now.setDate((i + type) - 1)).format('YYYY-MM-DD');
                        break;
                    }
                }
            }
        }
        last = moment(endDate).format('DD');
        if (last == '31') {
            setEndDate = parseInt(last) - type;
            startDate = moment(now.setDate(setEndDate)).format('YYYY-MM-DD');
        } else {
            startDate = moment(now.setDate(i)).format('YYYY-MM-DD');
        }
        if (endDate != '') break;
    }
    return {
        startDate: startDate,
        endDate: endDate
    };
};

rangeDate = function(date, type) {
    switch (type) {
        case '5':
            return getRank(date, 5);
        case '10':
            return getRank(date, 10);
        case '15':
            return getRank(date, 15);
        case '20':
            return getRank(date, 20);
        case '30':
            return getRank(date, 30);
    }
};

function insertGroupInvoice(collection, range, doc, groupCollection) {
    var groupInvoice = groupCollection.findOne({
        customerId: doc.iceCustomerId,
        startDate: moment(range.startDate).toDate(),
        endDate: moment(range.endDate).toDate()
    });
    if (groupInvoice) {
        var isUpdated = groupCollection.update(groupInvoice._id, {
            $addToSet: {
                invoices: doc
            },
            $inc: {
                total: doc.total
            }
        });
        if (isUpdated == 1) {
            collection.direct.update(doc._id, {
                $set: {
                    iceOrderGroupId: groupInvoice._id
                }
            });
            // doc.paymentGroupId = groupInvoice._id;
            // recalculatePaymentAfterInsert({doc});
        } else {
            collection.direct.remove(doc._id);
        }
    } else {
        var genId = idGenerator.genWithPrefix(groupCollection, doc.branchId + '-', 9);
        var obj = {
            _id: genId,
            startDate: moment(range.startDate).toDate(),
            endDate: moment(range.endDate).toDate(),
            total: doc.total,
            customerId: doc.iceCustomerId,
            status: 'active',
            invoices: [doc],
            branchId: doc.branchId
        };
        var isInserted = groupCollection.insert(obj);
        if (isInserted) {
            collection.direct.update(doc._id, {
                $set: {
                    iceOrderGroupId: isInserted
                }
            });
        } else {
            collection.direct.remove(doc._id);
        }
    }
}
