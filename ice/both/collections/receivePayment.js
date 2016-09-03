Ice.Collection.ReceivePayment = new Mongo.Collection('ice_receivePayment');
Ice.Schema.ReceivePayment = new SimpleSchema({
    branchId: {
        type: String,
        optional: true
    },
    invoiceId: {
        type: String,
        autoform: {
            type: 'select'
        }
    },
    paymentDate: {
        type: String,
        defaultValue: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    paidAmount: {
        type: Number,
        decimal: true,
    },
    dueAmount: {
        type: Number,
        decimal: true
    },
    balanceAmount: {
        type: Number,
        decimal: true
    },
    customerId: {
        type: String
    },
    status: {
        type: String,
        optional: true
    },
    staffId: {
        type: String,
        autoform: {
            type: 'select2',
            options: function () {
                return Ice.List.staff();
            }
        }
    },
    branchId: {
        type: String,
        optional: true
    }
});
Ice.Collection.ReceivePayment.attachSchema(Ice.Schema.ReceivePayment);
