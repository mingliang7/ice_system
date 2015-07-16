// Collection
Sample.Collection.Order = new Mongo.Collection("sample_order");

// Schema
Sample.Schema.Order = new SimpleSchema({
    orderDate: {
        type: String
    },
    customerId: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Sample.List.customer();
            }
        }
    },
    cpanel_branchId: {
        type: String,
        label: "Branch"
    }
});

// Attach schema
Sample.Collection.Order.attachSchema(Sample.Schema.Order);

// Attach soft remove
// Sample.Collection.Order.attachBehaviour('softRemovable');