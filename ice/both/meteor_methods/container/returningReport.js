Meteor.methods({
  returningReport: function (params) {
    this.unblock();
    var self = params;
    var data = {
      title: {},
      header: {},
      content: [],
      footer: {}
    };


    /********* Header ********/
    customerId = self.customer == '' ? 'All' : self.customer;
    staffId = self.staffId == '' ? 'All' : self.staffId;
    var company = Cpanel.Collection.Company.findOne();
    data.title = {
      company: company.enName,
      address: company.khAddress,
      telephone: company.telephone
    };
    data.header = {
      date: self.returnDate,
      customer: customerId,
      staff: staffId
    };
    /********** Content **********/
    var content = [];
    var selector = {};
    var index = 1;
    date = self.returnDate.split(' To ');
    startDate = date[0];
    addOneDay = moment(date[1]).add(1, 'days')
    endDate = moment(addOneDay._d).format('YYYY-MM-DD HH:mm:ss');
    selector.returningDate = {
      $gte: startDate,
      $lt: endDate
    }
    if (customerId != 'All') {
      selector.customerId = customerId;
    }
    if (staffId != 'All') {
      selector.staffId = staffId;
    }
    console.log(selector);
    var returnings = Ice.Collection.Returning.find(selector).fetch()
    returnings.forEach(function (returning) {
      returning.index = index;
      content.push(returning)
      index++;
    })

    if (content.length > 0) {
      data.content = content;
      data.footer = {

      }
      return data;
    } else {
      data.content.push({
        index: 'no results'
      });
      return data;
    }
  }
});
