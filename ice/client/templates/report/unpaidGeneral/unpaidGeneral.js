/***** Declare template *****/
var reportTpl = Template.ice_unpaidGeneral,
    generateTpl = Template.ice_unpaidGeneralGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

/***** Generate ******/
generateTpl.helpers({
    data: function () {
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
            company: company.enName
        };

        /********* Header ********/
        data.header = self;
        var arr = [self.date];
            arr.push('23:59:59')
        var today = arr.join(' ')
        /********** Content **********/ 
        var content = [];
        var selector = {orderDate: {$lte: today}, $or: [{closingDate: {$not: {$gt: today}}}, {closingDate: 'none'}]};
        var getOrder = Ice.Collection.Order.find(selector);
        var index =  1 ;
        getOrder.forEach(function (obj) {
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
    }
});
