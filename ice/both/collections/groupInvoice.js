Ice.Collection.GroupInvoice = new Mongo.Collection('ice_groupInvoice');
Ice.Schema.GroupInvoice_schema = new SimpleSchema({
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    invoices: {
        type: [Object],
        blackbox: true,
    },
    total: {
        type: Number,
        decimal: true
    },
    status: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return 'active';
            }
        }
    },
    customerId: {
        type: String
    },
    customerName: {
        type: String,
        optional: true
    },
    branchId: {
        type: String,
        optional: true
    }
});
Ice.Collection.GroupInvoice.attachSchema(Ice.Schema.GroupInvoice_schema);
