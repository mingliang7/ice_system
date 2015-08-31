// Dental.ListForReportState = new ReactiveObj();
// /************ Form *************/
// Template.dental_invoiceReport.onCreated(function () {
//     createNewAlertify('exchange');
// });

// Template.dental_invoiceReport.onRendered(function () {
//     var name = $('[name="date"]');
//     DateTimePicker.date(name);
// });

// Template.dental_invoiceReport.events({
//     'click .exchangeAddon': function (e, t) {
//         alertify.exchange(fa("plutoJSONValue(val);s", "Exchange"), renderTemplate(Template.cpanel_exchangeInsert));
//     },
//     'change .patientId': function (e, t) {
//         var patientId = $(e.currentTarget).val();
//         return Dental.ListForReportState.set("patientId", patientId);
//     }

// });
/************ Generate *************/
Template.ice_invoiceReportGen.helpers({
    data: function () {
        var id = Router.current().params.id;
        var callId = JSON.stringify(id);
        var call = Meteor.callAsync(callId, 'retailInvoice', id);
        if(!call.ready()){
            return false;
        }

        return call.result();
    },
    check: function(){
       
    },

    itemName: function(id){
        var name = Ice.Collection.Item.findOne(id).name;
        return name;
    },
    itemDiscount: function(discount) {
        if(discount == undefined){
            return '';
        }else{
            return discount;
        }
    }
});

var formatDollar = function(value){
    return numeral(value).format('0,0.00');
}
var formatKH = function(value){
    return numeral(value).format('0,0');
}