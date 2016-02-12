Meteor.methods({
  removeInvoiceLogReport:function(params){
    this.unblock();
    var self = params;
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
    var user = self.user == '' ? '' : self.user;
    var date = self.date.split(' To ') ;
    var startDate = date[0];
    var endDate = date[1];
    var selector = {}
    if(user == ''){
        selector = {dateTime: {$gte: startDate, $lte: endDate}};
    }else{
        selector = {'removedBy.id': user, dateTime: {$gte: startDate, $lte: endDate}};
    }
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
  }
});
