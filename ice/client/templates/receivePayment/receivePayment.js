Tracker.autorun(function () {
    if (Session.get('customer')) {
        console.log('In tracker');
        Meteor.call('getActiveGroupInvoice', Session.get('customer'), function (err, result) {
            Session.set('invoiceOptions', result);
        });
    }
    if (Session.get('invoiceId')) {
        Meteor.call('getGroupInvoiceBalance', Session.get('invoiceId'), function (err, result) {
            Session.set('invoiceBalance', result);
        })
    }
});
var newTmpl = Template.ice_receivePaymentNew,
    indexTmpl = Template.ice_receivePayment;
newTmpl.onRendered(function () {
    var query = Router.current().params.query;
    if (query.ci && query.in) {
        Session.set('customer', query.ci); //ci is customerId
        Session.set('invoiceId', query.in); //in is invoiceId
        Session.set('paramCustomerName', query.cn);//cn is customer name
    }
    Meteor.typeahead.inject();
    datePicker();
});
indexTmpl.events({
    'click .remove': function (event) {
        console.log(this);
        var doc = this;
        swal({
            title: "Are you sure?",
            text: "ធ្វើការលុបវិក័យប័ត្របង់ប្រាក់លេខ " + this._id,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('removedReceivePayment', doc);
            swal("Deleted!", "វិក័យប័ត្របង់ប្រាក់លេខ " + doc._id + " បានលុបដោយជោគជ័យ", "success");
        });
    }
});
newTmpl.events({
    'keyup .customer': function (event) {
        clearSession();
        if (event.currentTarget.value == '') {
            $('[name="customerId"]').val('')
            // $('[name="invoiceId"]').attr('disabled', true);
            $('[name="invoiceId"]').val('');
        }
    },
    'click .customer': function () {
        $('.customer').select()
    },
    'change [name="invoiceId"]': function (event) {
        if (event.currentTarget.value != '') {
            Session.set('invoiceId', event.currentTarget.value);
        }
    },
    'change [name="paidAmount"]': function (event) {
        var invoiceBalance = Session.get('invoiceBalance');
        if (event.currentTarget.value != '') {
            var paidAmount = event.currentTarget.value;
            if (parseFloat(paidAmount) > invoiceBalance.dueAmount) {
                $(event.currentTarget).val(invoiceBalance.dueAmount);
                invoiceBalance.balanceAmount = 0;
                Session.set('invoiceBalance', invoiceBalance);
            } else {
                invoiceBalance.paidAmount = parseFloat(paidAmount);
                invoiceBalance.balanceAmount = invoiceBalance.dueAmount - invoiceBalance.paidAmount;
                Session.set('invoiceBalance', invoiceBalance);
            }
        }
    },
    "keypress [name='paidAmount']": function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }
});

newTmpl.helpers({
    search: function (query, sync, callback) {
        var type = {};
        console.log(query);
        Meteor.call('generalCustomer', query, {}, {$ne: 'general'}, function (err,
                                                                              res) {
            if (err) {
                console.log(err);
                return;
            }
            if (res.length > 0) {
                callback(res.map(function (v) {
                    var customerType = v.customerType == 'general' ?
                        'General' : v.customerType +
                    'ថ្ងៃ';
                    return {
                        value: v._id + ' | ' + v.name + ' | ' +
                        customerType,
                        _id: v._id
                    };
                }));
            } else {
                var displayNoResult = [{
                    message: 'No more results!',
                    _id: ''
                }];
                callback(displayNoResult.map(function (v) {
                    return {
                        value: v.message,
                        _id: v._id
                    }
                }));
            }
        });
    },
    selected: function (event, suggestion, datasetName) {
        // event - the jQuery event object
        // suggestion - the suggestion object
        // datasetName - the name of the dataset the suggestion belongs to
        // TODO your event handler here

        if (suggestion._id != '') {
            $('[name="customerId"]').val(suggestion._id)
            Session.set('customer', suggestion._id);
        }
        if (suggestion._id == '') {
            $('[name="customerId"]').val('')
        }
    },
    invoiceOptions: function () {
        var invoices = Session.get('invoiceOptions');
        console.log(invoices);
        return _.isUndefined(invoices) ? [] : invoices;
    },
    dueAmount: function () {
        var invoiceBalance = Session.get('invoiceBalance');
        return _.isUndefined(invoiceBalance) ? '' : invoiceBalance.dueAmount;
    },
    balanceAmount: function () {
        var invoiceBalance = Session.get('invoiceBalance');
        return _.isUndefined(invoiceBalance) ? '' : invoiceBalance.balanceAmount;
    },
    paidAmount: function () {
        var invoiceBalance = Session.get('invoiceBalance');
        return _.isUndefined(invoiceBalance) ? '' : invoiceBalance.paidAmount;
    },
    customerId: function () {
        return Session.get('customer');
    },
    invoiceId: function () {
        return Session.get('invoiceId');
    },
    customerNameParam: function () {
        if (Session.get('paramCustomerName')) {
            return Session.get('paramCustomerName');
        }
        return ''
    }
});

var datePicker = function () {
    var paymentDate = $('[name="paymentDate"]');
    return DateTimePicker.dateTime(paymentDate);
};
newTmpl.onDestroyed(function () {
    clearSession();
    Ice.Collection.ReceivePaymentTmpCollection.remove({});
});
AutoForm.hooks({
    ice_receivePaymentNew: {
        before: {
            insert: function (doc) {
                doc.branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (type, result) {
            $('[name="staffId"]').select2('val', '');
            alertify.success('Successful');
            Session.set('invoiceBalance', undefined);
            Session.set('invoiceId', undefined);
            Session.set('customer', undefined)
        },
        onError: function (type, err) {
            alertify.error(err.message);
        }
    }
});
function clearSession() {
    Session.set('invoiceBalance', undefined);
    Session.set('invoiceId', undefined);
    Session.set('customer', undefined);
    Session.set('paramCustomerName', undefined);
    Session.set('invoiceOptions', []);
}