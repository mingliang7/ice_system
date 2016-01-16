Session.setDefault('customer', '');

Template.ice_paymentInsertTemplate.onRendered(function () {
    return createNewAlertify(['staffAddOn', 'invoiceAddOn', 'customerAddOn']);
});
Template.ice_payment.onRendered(function () {
    return createNewAlertify(['paymentForm', 'staffAddOn', 'invoiceAddOn',
        'customerAddOn'
    ]);
});

Template.ice_payment.helpers({
    foo: function () {
        var self;
        if (this !== null) {
            self = this;
            Session.set(customer, findCustomer(self.customerId));
        }
        Session.get('customer');
    }

});
//tabular
Template.ice_paymentTabular.onRendered(function() {
    var paymentFilterDate;
    paymentFilterDate = $('[name="payment-filter-date"]');
    return DateTimePicker.dateRange(paymentFilterDate);
});

Template.ice_paymentTabular.helpers({
    selector: function() {
        var date, today;
        date = Session.get('paymentFilterDate');
        if (date === void 0) {
            today = moment(new Date()).format('YYYY-MM-DD');
            return {
                paymentDate: {
                    $gte: today + " 00:00:00",
                    $lte: today + " 23:59:59"
                }
            };
        } else {
            console.log(date)
            return date;
        }
    },
    paymentFilterDate: function() {
        var today;
        today = moment(new Date()).format('YYYY-MM-DD');
        return today + " To " + today + " ";
    }
});

Template.ice_paymentTabular.events({
    'change [name="payment-filter-date"]': function(e) {
        var selectedDateRange, selector;
        selector = {};
        selectedDateRange = e.currentTarget.value.split(' To ');
        selector.paymentDate = {
            $gte: selectedDateRange[0] + " 00:00:00",
            $lte: selectedDateRange[1] + " 23:59:59"
        };
        return Session.set('paymentFilterDate', selector);
    }
});

Template.ice_paymentTabular.onDestroyed(function() {
    return Session.set('paymentFilterDate', void 0);
});
//end tabular


Template.ice_payment.events({
    'click .insert': function () {
        Session.set('checkIfUpdate', false);
        Router.go('ice.ice_paymentInsertTemplate');
    },
    'click .remove': function () {
        Meteor.call('checkAvailablityPayment', this, function (err, result) {
            var flag = '';
            result.payments.forEach(function (payment) {
                flag = (result.currentPayment >= payment.paymentDate) ?
                    true :
                    false;
            });
            flag ? onRemoved(result.doc) : alertify.warning(
                'Sorry! invoice ' + result.id +
                ' is not a last record :( ');
        });
    },
    'click .show': function () {
        alertify.paymentForm(fa('eye', 'Payment'), renderTemplate(Template.ice_paymentShowTemplate,
            this));
    },
    'click .update': function () {
        Meteor.call('checkAvailablityPayment', this, function (err, result) {
            var flag = '';
            result.payments.forEach(function (payment) {
                flag = (result.currentPayment >= payment.paymentDate) ?
                    true :
                    false;
            });
            var id = result.id;
            if (flag) {
                Session.set('checkIfUpdate', true);
                Router.go('ice.ice_paymentUpdate', {
                    id: id
                });
                Session.set('paymentFlag', undefined);
            } else {
                alertify.warning('Sorry! invoice ' + id +
                    ' is not a last record :( ');
            }
        });
    }
});
var insertTpl = Template.ice_paymentInsertTemplate
insertTpl.onRendered(function () {
    Meteor.typeahead.inject();
})
insertTpl.events({
    'keyup .customer': function (event) {
        if (event.currentTarget.value == '') {
            $('[name="customerId"]').val('')
            $('[name="orderId_orderGroupId"]').attr('disabled', true);
            $('[name="orderId_orderGroupId"]').val('');
        }
    },
    'click .customer': function () {
        $('.customer').select()
    }
})
insertTpl.helpers({
    search: function (query, sync, callback) {
        var type = {};
        Meteor.call('generalCustomer', query, {}, type, function (err,
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
                }]
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
            $('[name="orderId_orderGroupId"]').attr('disabled', false);
            Session.set('customer', suggestion._id);
        }
        if (suggestion._id == '') {
            $('[name="orderId_orderGroupId"]').attr('disabled', true);
            $('[name="customerId"]').val('')
        }
    }
})
Template.ice_paymentInsertTemplate.events({
    'click .customerAddOn': function () {
        alertify.customerAddOn(fa('plus', 'Customer'), renderTemplate(
            Template.ice_insertTemplate));
    },
    'click .invoiceAddOn': function () {
        alertify.invoiceAddOn(fa('shopping-cart', 'Order'), renderTemplate(
            Template.ice_orderInsertTemplate)).maximize();
    },
    'click .staffAddOn': function () {
        alertify.staffAddOn(fa('plus', 'Staff'), renderTemplate(Template.ice_staffInsertTemplate));
    },
    'blur [name="paymentDate"]': function (e) {
        var currentDate = e.currentTarget.value;
        var checkDate = Session.get('checkDate');
        if (checkDate != '') {
            if (currentDate < checkDate) {
                alertify.warning('Date Must greater than ' + checkDate);
                $("[name='paymentDate']").val('');
            }
        }
    },
    'change [name="orderId_orderGroupId"]': function (e) {
        var currentInvoice, currentInvoiceId, type;
        currentInvoiceId = $(e.currentTarget).val();
        Session.set('currentInvoiceId', currentInvoiceId);
        datePicker();
        type = Ice.ListForReportState.get('type');

        if (type === 'general') {
            Meteor.call('orderId', currentInvoiceId, function (err,
                                                               currentInvoice) {
                $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
                $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
                $('[name="outstandingAmount"]').val(0);
            });
        } else {
            Meteor.call('orderGroupId', currentInvoiceId, function (err,
                                                                    currentInvoice) {
                $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
                $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
                $('[name="outstandingAmount"]').val(0);
            });
        }
    },
    'keyup [name="paidAmount"]': function () {
        var dueAmount, paidAmount;
        try {
            paidAmount = $('[name="paidAmount"]').val();
        } catch (e) {
            console.log(e);
        }
        dueAmount = parseInt($('[name="dueAmount"]').val());
        if (parseInt(paidAmount) > dueAmount) {
            $('[name="paidAmount"]').val(dueAmount);
            $('[name="outstandingAmount"]').val(0);
        } else if (paidAmount === '') {
            $('[name="outstandingAmount"]').val(dueAmount);
        } else {
            $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
        }
    }
});
Template.ice_paymentUpdateTemplate.events({
    'keyup [name="paidAmount"]': function () {
        dueAmount = $('[name="dueAmount"]').val();
        paidAmount = $('[name="paidAmount"]').val();
        dueAmount = parseFloat(dueAmount);
        paidAmount = parseFloat(paidAmount);
        outstandingAmount = dueAmount - paidAmount;
        console.log(paidAmount);
        if (paidAmount > dueAmount) {
            $('[name="paidAmount"]').val(dueAmount);
            $('[name="outstandingAmount"]').val(0);
        } else {
            $('[name="outstandingAmount"]').val(outstandingAmount);
        }
    }
});
Template.ice_paymentInsertTemplate.helpers({
    invoiceOption: function () {
        if (Session.get('customer')) {
            invoice = ReactiveMethod.call('invoice', false, Session.get(
                'customer'));
            Ice.ListForReportState.set('type', invoice.type);
            return invoice.list;
        }
    },
    checkDate: function () {
        var invoiceId = Session.get('currentInvoiceId')
        payments = ReactiveMethod.call('payment', invoiceId)
        var maxDate = '';
        if (payments != undefined) {
            payments.forEach(function (payment) {
                maxDate = maxDate > payment.paymentDate ? maxDate :
                    payment.paymentDate
            });
        }
        Session.set('checkDate', maxDate);
        return maxDate == "" ? '' : 'Date Must >' + maxDate;
    }
});
Template.ice_paymentUpdateTemplate.helpers({
    getCustomer: function (id) {
        if (!_.isUndefined(id)) {
            return ReactiveMethod.call('getCustomerName', id);
        }
    }
});
Template.ice_paymentShowTemplate.helpers({
    format: function (value) {
        return numeral(value).format('0,0');
    },
    customer: function (id) {
        var name = Ice.Collection.Customer.findOne(id).name;
        return id + '(' + name + ')';
    }
});

//functions
var findCustomer = function (id) {
    var name;
    name = Ice.Collection.Customer.findOne(id).name;
    return name;
};


var removeDoc = function (doc) {
    var doc = doc;
    alertify.confirm((fa('remove'), 'Remove Payment'), 'Are you sure to remove' +
        doc._id + '?',
        function () {
            Ice.Collection.Payment.remove(doc._id, function (error) {
                checkType(doc);
                alertify.message('Successfully remove');
            });
        }, null);

};

var checkType = function (doc) {
    Meteor.call("getCustomerType", doc, function (err, result) {
        if (result.type == 'general') {
            removeOrderPayment(result.data);
        } else {
            removeOrderGroupPayment(result.data);
        }
    });
};

var checkAvailablity = function (doc) {

};
//remove payment and update order
var onRemoved = function (doc) {
    removeDoc(doc);
};


var removeOrderPayment = function (doc) {
    Meteor.call('removeOrderPayment', doc);
};

var removeOrderGroupPayment = function (doc) {
    Meteor.call('removeOrderGroupPayment', doc);
};

var datePicker = function (currentInvoiceId) {
    var paymentDate = $('[name="paymentDate"]');
    return DateTimePicker.dateTime(paymentDate);
};
