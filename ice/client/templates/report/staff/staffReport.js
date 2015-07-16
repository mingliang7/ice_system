
Template.ice_staffReport.onRendered(function() {
  datePicker();
});

Template.ice_staffReport.events({
  'change [name="customerType"]': function(e) {
    var value;
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customerType', value);
  },
  'change [name="date"]': function(e) {
    value = $('[name="date"]').val().split(' To ')
    Ice.ListForReportState.set('dateRange', value);
  },
  'keyup [name="date"]': function(e) {
    value = $('[name="date"]').val().split(' To ')
    Ice.ListForReportState.set('dateRange', value);
  }
});

datePicker = function() {
  var date;
  date = $('[name="date"]');
  return DateTimePicker.dateTimeRange(date);
};

/***** Generate ******/
Template.ice_staffReportGen.helpers({
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
            company: company
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

