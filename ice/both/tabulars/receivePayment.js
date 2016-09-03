Ice.Collection.TmpCollection = new Mongo.Collection(null);
Ice.TabularTable.ReceivePayment = new Tabular.Table({
    name: "iceReceivePayment",
    collection: Ice.Collection.ReceivePayment,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.ice_receivePaymentAction
        },
        {data: "_id", title: "ID"},
        {
            data: 'invoiceId',
            title: 'Invoice ID'
        },
        {
            data: "customerId",
            title: "Customer",
            render: function (val) {
                // Meteor.call('getCustomer', {customerId: val}, function (err, result) {
                //     let customer = tmpCollection.findOne(result._id);
                //     if(!customer) {
                //         tmpCollection.insert(result);
                //     }
                // });
                // try {
                //     return tmpCollection.findOne(val).name;
                //
                // }catch (e) {
                //
                // }
            }
        },
        {
            data: "paymentDate",
            title: "Payment Date",
            render: function (val) {
                return moment(val).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            data: "dueAmount",
            title: "Due Amount",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        }, {
            data: "paidAmount",
            title: "Paid Amount",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        }, {
            data: "balanceAmount",
            title: "Balance",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        },

        {
            data: "status",
            title: "Status",
            render: function (val) {
                if (val == 'closed') {
                    return '<span class="label label-success">C</span>'
                } else if (val == 'partial') {
                    return '<span class="label label-danger">P</span>'
                }
                return '<span class="label label-info">A</span>'
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
    pagingType: "full_numbers",
    autoWidth: false
});
