Ice.Collection.TmpCollection = new Mongo.Collection(null);
Ice.TabularTable.GroupInvoice = new Tabular.Table({
    name: "iceGroupInvoice",
    collection: Ice.Collection.GroupInvoice,
    columns: [{
        title: '<i class="fa fa-bars"></i>',
        tmpl: Meteor.isClient && Template.ice_groupInvoiceAction
    },{
        data: "_id",
        title: "ID"
    }, {
        data: "startDate",
        title: "Start Date",
        render: function (val) {
            return moment(val).format('YYYY-MM-DD');
        }
    }, {
        data: "endDate",
        title: "End Date",
        render: function (val) {
            return moment(val).format('YYYY-MM-DD');
        }
    }, {
        data: "customerId",
        title: "User",
        render: function (customerId) {
            var customer = Ice.Collection.TmpCollection.findOne(customerId);
            if (!customer) {
                Meteor.call('groupCustomer', customerId, function (err, result) {
                    Ice.Collection.TmpCollection.insert(result);
                });
                return Ice.Collection.TmpCollection.findOne(customerId).name;
            }
            return customer.name;
        }
    }, {
        data: 'total',
        title: 'Total'
    }

    ],
    order: [
        ['1', 'desc']
    ],
    columnDefs: [{
        "width": "12px",
        "targets": 0
    }],
    extraFields: ['invoices'],
    pagingType: "full_numbers",
    autoWidth: false
});
