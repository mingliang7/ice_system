var dataState = new ReactiveVar();
var indexTmpl = Template.ice_receivePaymentReport,
    genTmpl = Template.ice_receivePaymentReportGen;
indexTmpl.onRendered(function () {
    datePicker();
});

indexTmpl.events({
    'change [name="staffId"]': function (e) {
        value = $(e.currentTarget).val();
        return Ice.ListForReportState.set('staffId', value);
    },
    'change [name="customerType"]': function (e) {
        value = $(e.currentTarget).val();
        return Ice.ListForReportState.set('customerType', value);
    },
    'change [name="date"]': function (e) {
        value = $('[name="date"]').val().split(' To ')
        Ice.ListForReportState.set('dateRange', value);
    },
    'keyup [name="date"]': function (e) {
        value = $('[name="date"]').val().split(' To ')
        Ice.ListForReportState.set('dateRange', value);
    }
});

indexTmpl.helpers({
    customerOption: function () {
        type = Ice.ListForReportState.get('customerType');
        console.log(type);
        if (!_.isEmpty(type)) {
            return ReactiveMethod.call('customerByType', type);
        } else {
            return [{
                label: 'All',
                value: ''
            }];
        }
    }
});
genTmpl.created = function () {
    this.autorun(function () {
        Meteor.call('receivePaymentReport', Router.current().params.query, function (err, result) {
            dataState.set(result);
        });
    });
};
genTmpl.helpers({
    data: function() {
        if(dataState.get()) {
            console.log(dataState.get());
            return dataState.get();
        }
        return false;
    }
});

var datePicker = function () {
    var date;
    date = $('[name="date"]');
    DateTimePicker.dateRange(date);
};
