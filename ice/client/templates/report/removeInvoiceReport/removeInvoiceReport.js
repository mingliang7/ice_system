/***** Declare template *****/
var reportTpl = Template.ice_removeInvoiceReport,
    generateTpl = Template.ice_removeInvoiceReportGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

/***** Generate ******/
generateTpl.helpers({
    dataReport: function () {
        var self = this;
        var data = {
            title: {},
            header: {},
            content: [],
            footer: {}
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.enName,
            address: company.khAddress,
            telephone: company.telephone
        };
        /********* Header ********/
        data.header = self;

        /********** Content **********/
        var content = [];
        var date = self.date ;
        var selector = {dateTime: {$gte: date}}
        var removeInvoice = Ice.Collection.RemoveInvoiceLog.find(selector);
        var index = 1;
        removeInvoice.forEach(function (obj) {
            // Do something
            obj.index = index;

            content.push(obj);

            index++;
        });
        if (content.length > 0) {
            data.content = content;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }, 
    listData: function(data){
        console.log(data)
    },
    findName: function(id){
        return Ice.Collection.Item.findOne(id).name;
    }
});