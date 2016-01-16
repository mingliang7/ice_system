Template.ice_paymentById.onRendered(function () {
    return createNewAlertify(['staffAddOn', 'invoiceAddOn', 'customerAddOn']);
});
Template.ice_paymentById.onRendered(function () {
    var invoiceId = Router.current().params.id;
    var monitor = Session.get('monitor');
    datePicker();
    orderMethod = (monitor == 'general' || monitor == 'order') ? 'orderId' : 'orderGroupId';
    Meteor.call(orderMethod, invoiceId, function (err, result) {
        if (result) {
            Session.set('invoiceObj', result);
        }
    })
});
Template.ice_paymentById.events({
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
    }
});
Template.ice_paymentById.helpers({
    customerName: function () {
        var customerId = Router.current().params.customerId;
        return ReactiveMethod.call('getCustomerName', customerId)
    },
    customerId: function () {
        return Router.current().params.customerId;
    },
    invoiceId: function () {
        return Router.current().params.id;
    },
    dueAmount: function () {
        var invoiceObj = Session.get('invoiceObj');
        return invoiceObj.outstandingAmount;
    },
    paidAmount: function () {
        var invoiceObj = Session.get('invoiceObj');
        return invoiceObj.outstandingAmount;
    },
    outstandingAmount: function () {
        return 0;
    },
    checkDate: function () {
        var invoiceId = Router.current().params.id;
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


//functions
var findCustomer = function (id) {
    var name;
    name = Ice.Collection.Customer.findOne(id).name;
    return name;
};


var removeDoc = function (doc) {
    var doc = doc;
    alertify.confirm((fa('remove'), 'Remove Payment'),
        'Are you sure to remove' +
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


AutoForm.hooks({
    ice_paymentById: {
        before: {
            insert: function (doc) {
                debugger
                doc.branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            Session.set('invoiceObj', undefined);
            Session.set('checkDate', undefined);
            alertify.success('successfully');
            monitor = Session.get('monitor');
            if (monitor == 'general') {
                Router.go('ice.paymentGeneralMonitor');
                Session.set('monitor', undefined);
            } else if (monitor == 'group') {
                Router.go('ice.paymentGroupMonitor');
                Session.set('monitor', undefined);
            }
            else {
                Router.go('ice.order');
            }
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
