Template.ice_paymentGroupMonitor.helpers({
    selector: function () {
        return {closing: false}
    }
});

Template.ice_paymentGroupMonitor.events({
    'click .groupPayment': function () {
        self = this;
        Session.set('monitor', 'group');
        Router.go('ice.paymentById', {customerId: self.iceCustomerId, 'id': self._id});
    }
});