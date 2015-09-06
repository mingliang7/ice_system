/***** Declare template *****/
var reportTpl = Template.ice_removeInvoiceReport,
    generateTpl = Template.ice_removeInvoiceReportGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateTimeRange(name);
});

/***** Generate ******/
generateTpl.helpers({
    dataReport: function () {
        var self = this;
        var id = JSON.stringify(self);
        var call = Meteor.callAsync(id, 'removeInvoiceLogReport', self);
        if(!call.ready()){
          return false;
        }
        return call.result();
    },
    listData: function(data){
        console.log(data)
    },
    findName: function(id){
        return Ice.Collection.Item.findOne(id).name;
    },
    formatKh: function(val){
        return numeral(val).format('0,0');
    },
    formatUS: function(val){
        return numeral(val).format('0,0.00');
    }
});
