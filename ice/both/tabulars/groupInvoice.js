Ice.Collection.TmpCollection = new Mongo.Collection(null);
Ice.TabularTable.GroupInvoice = new Tabular.Table({
    name: "iceGroupInvoice",
    collection: Ice.Collection.GroupInvoice,
    columns: [{
        title: '<i class="fa fa-bars"></i>',
        tmpl: Meteor.isClient && Template.ice_groupInvoiceAction
    }, {
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
        title: "Customer",
        render: function (customerId) {
            var customer = Ice.Collection.TmpCollection.findOne(customerId);
            if (!customer) {
                Meteor.call('groupCustomer', customerId, function (err, result) {
                    Ice.Collection.TmpCollection.insert(result);
                });
                var currentCustomer = Ice.Collection.TmpCollection.findOne(customerId);
                return currentCustomer.name + '(' + currentCustomer.customerType + 'ថ្ងៃ' + ')' ;
            }
            return customer.name + '(' + customer.customerType + 'ថ្ងៃ' + ')';
        }
    }, {
        data: 'total',
        title: 'Total'
    }, {
        data: 'status',
        title: 'Status',
        render: function (val) {
            if (val == 'closed') {
                return '<span class="label label-success">C</span>';
            } else if (val == 'active') {
                return '<span class="label label-primary">A</span>';
            } else {
                return '<span class="label label-danger">P</span>';
            }
        }
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
