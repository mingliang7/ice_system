Meteor.methods({
    removeOrderPayment: function(doc) {
        console.log(doc)
        var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId)._payment;
        delete oldPaymentDetail[doc._id];
        var oldOrder = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
        if (_.isEmpty(oldPaymentDetail)) {
            Ice.Collection.Order.update({
                _id: doc.orderId_orderGroupId
            }, {
                $unset: {
                    _payment: ''
                },
                $set: {
                    paidAmount: oldOrder.paidAmount - doc.paidAmount,
                    outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                    closing: false,
                    closingDate: 'none'
                }
            });
        } else {
            Ice.Collection.Order.update({
                _id: doc.orderId_orderGroupId
            }, {
                $set: {
                    _payment: oldPaymentDetail,
                    paidAmount: oldOrder.paidAmount - doc.paidAmount,
                    outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                    closing: false,
                    closingDate: 'none'
                }
            });
        }
    },
    removeOrderGroupPayment: function(doc) {
        var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId)._payment;
        delete oldPaymentDetail[doc._id];
        var oldOrder = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId);
        if (_.isEmpty(oldPaymentDetail)) {
            Ice.Collection.OrderGroup.update({
                _id: doc.orderId_orderGroupId
            }, {
                $unset: {
                    _payment: ''
                },
                $set: {
                    paidAmount: oldOrder.paidAmount - doc.paidAmount,
                    outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                    closing: false,
                    closingDate: 'none'
                }
            });
        } else {
            Ice.Collection.OrderGroup.update({
                _id: doc.orderId_orderGroupId
            }, {
                $set: {
                    _payment: oldPaymentDetail,
                    paidAmount: oldOrder.paidAmount - doc.paidAmount,
                    outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                    closing: false,
                    closingDate: 'none'
                }
            });
        }
    },
    getCustomerType: function(doc) {
        type = Ice.Collection.Customer.findOne(doc.customerId).customerType;
        return {
            data: doc,
            type: type
        }
    },
    payment: function(id){
        var payments = Ice.Collection.Payment.find({orderId_orderGroupId: id}).fetch();
        console.log(payments);
        return payments

    }
});