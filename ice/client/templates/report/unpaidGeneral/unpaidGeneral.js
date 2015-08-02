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
            company: company.khName
        };

        /********* Header ********/
        data.header = self;

        /********** Content **********/
        var content = [];
        var selector = {};

        if (!_.isEmpty(self.branch)) {
            selector.cpanel_branchId = self.branch;
        }
        if (!_.isEmpty(self.name)) {
            selector.name = self.name;
        }

        var getCustomer = Sample.Collection.Customer.find(selector);
        var index = 1;
        getCustomer.forEach(function (obj) {
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
    }
});