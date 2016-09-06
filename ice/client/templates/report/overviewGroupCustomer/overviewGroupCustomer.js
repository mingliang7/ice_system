var dataState = new ReactiveVar();
var genTmpl = Template.ice_overviewGroupCustomerGen,
    indexTmpl = Template.ice_overviewGroupCustomer;

indexTmpl.rendered = function () {
    dateTimePicker();
};
genTmpl.created = function () {
    this.autorun(function () {
        Meteor.call('overviewGroupCustomer', Router.current().params.query, function (err, result) {
            dataState.set(result);
        });
    });
};

genTmpl.helpers({
    data: function() {
        console.log(dataState.get());
        if(dataState.get()) {
            return dataState.get();
        }
        return false;
    },
    getTotal: function(dueAmount, paidAmount, total, customerName){
        var string = '<td></td><td></td>';
        string += '<td><u>Total ' + _.capitalize(customerName) + ':</u></td><td><u>'+ numeral(dueAmount).format('0,0') + '</u></td><td><u>' + numeral(paidAmount).format('0,0') + '</u></td><td><u>' + numeral(total).format('0,0') + '</u></td>';
        return string;
    },
});

function dateTimePicker() {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
}