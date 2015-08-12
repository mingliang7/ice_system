/************ Generate *************/
Template.ice_invoiceGeneralReport.onRendered(function(){
   datePicker(); 
});
Template.invoiceGeneralReportGen.helpers({
    data: function () {
        var self = this;
        var id = JSON.stringify(self);
        var generalOrders = Meteor.callAsync(id, 'generalOrder', self)
        if(!generalOrders.ready()){
            return false;
        }
        return generalOrders.result();
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

var datePicker = function() {
  var date = $('[name="date"]');
  DateTimePicker.dateTimeRange(date);
};
