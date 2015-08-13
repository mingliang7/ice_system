/***** Declare template *****/
var reportTpl = Template.ice_unpaidGeneral,
    generateTpl = Template.ice_unpaidGeneralGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

/***** Generate ******/
generateTpl.helpers({
    data: function () {
        var self = this;
        var id = JSON.stringify(self);
        var callUnpaid = Meteor.callAsync(id, 'unpaidGeneral',self);       
        if(!callUnpaid.ready()){
            return false;
        }
        return callUnpaid.result();
    },
    formatKh: function(val){
        return numeral(val).format('0,0');
    },
    totalAmount: function(content) {
        dueAmount = 0 ;
        paidAmount = 0 ;
        outstandingAmount = 0;
        content.forEach(function(elem) {
            dueAmount += elem._payment.dueAmount;
            paidAmount += elem._payment.paidAmount;
            outstandingAmount +=elem._payment.outstandingAmount;
        });
        return '<td><strong>' + formatKh(dueAmount) + '</strong></td>' + '<td><strong>' + formatKh(paidAmount) + '</strong></td>' + 
            '<td><strong>' + formatKh(outstandingAmount) + '</strong></td>';

    }
});



var formatKh = function(value){
    return numeral(value).format('0,0');
}