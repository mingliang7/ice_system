Template.ice_paymentGeneralMonitor.helpers({
    selector: function () {
        return {closing: false}
    }
});


Template.ice_paymentGeneralMonitor.events({
    'click .payment': function (e) {
        self = this;
        if (self._customer.customerType == 'general') {
            if (self.outstandingAmount != 0) {
                Session.set('monitor', 'general');
                Router.go('ice.paymentById', {customerId: self.iceCustomerId, 'id': self._id});
            } else {
                alertify.warning("Already Paid!")
            }
        }
        else {
            alertify.warning('CustomerType is not general');
        }
    }
});