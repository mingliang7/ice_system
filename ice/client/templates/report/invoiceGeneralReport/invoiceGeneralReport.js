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

    extract: function(item){
        var concate = ''
        item.forEach(function(obj) {
            concate += '<tr><td colspan="2">' + itemName(Object.keys(obj).join('')) + '</td>'
            for(var k in obj){
                concate +=      '<td>' + obj[k].qty +'</td>' +
                                '<td>' + formatKH(obj[k].price) +'</td>' +
                                '<td>' + itemDiscount(obj[k].discount) + '</td>'+
                                '<td>' + formatKH(obj[k].amount) + '</td>';
                    
            }
            concate += '</tr>'

        });
        return concate;
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
var itemName = function(id){
    return Ice.Collection.Item.findOne(id).name;
}
var datePicker = function() {
  var date = $('[name="date"]');
  DateTimePicker.dateTimeRange(date);
};

var itemDiscount = function(discount) {
        if(discount == undefined){
            return '';
        }else{
            return discount;
        }
}