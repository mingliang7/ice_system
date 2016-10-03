var indexTmpl = Template.ice_orderGroup;

indexTmpl.events({
    'click .remove': function (event) {
        var doc = this;
        swal({
            title: "Are you sure?",
            text: "ធ្វើការលុបវិក័យប័ត្រលេខ" + this._id,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('removeGroupInvoice', doc);
            swal("Deleted!", "វិក័យប័ត្របង់ប្រាក់លេខ " + doc._id + " បានលុបដោយជោគជ័យ", "success");
        });
    },
    'click .groupPayment': function (event) {
        var doc = this;
        Meteor.call('groupCustomer', doc.customerId, function (err, result) {
            var url = '/ice/receive-payment/new?' + 'cn=' + doc.customerId + ' | ' + result.name + '&ci=' + doc.customerId + '&in=' + doc._id;
            Router.go(url);
        });
    },
    'click .show': function (event) {
        var data = this;
        var url = '/ice/groupInvoiceReportGen?status=&customerType=&' + 'customerId=' + data.customerId + '&date=' +
            moment(data.startDate).format('YYYY-MM-DD') + ' To ' + moment(data.endDate).format('YYYY-MM-DD') + '&invoiceId=' + data._id;
        window.open(url, "_blank");
    }
});
indexTmpl.onDestroyed(function () {
    Ice.Collection.TmpCollection.remove({});
});
