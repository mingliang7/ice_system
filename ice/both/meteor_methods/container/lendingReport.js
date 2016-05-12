Meteor.methods({
  lendingReport: function (params) {
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
    type = self.type == '' ? 'All' : self.type;
    var company = Cpanel.Collection.Company.findOne();
    data.title = {
      type: type,
      company: company.enName,
      address: company.khAddress,
      telephone: company.telephone
    };
    data.header = {
      date: self.lendingDate,
      customer: customerId,
      staff: staffId
    };
    /********** Content **********/
    var content = [];
    var selector = {};
    var index = 1;
    date = self.lendingDate.split(' To ');
    startDate = date[0];
    addOneDay = moment(date[1]).add(1, 'days')
    endDate = moment(addOneDay._d).format('YYYY-MM-DD HH:mm:ss');
    selector.lendingDate = {
      $gte: startDate,
      $lt: endDate
    }
    if (type != 'All') {
      selector.lendingType = type
    }
    if (customerId != 'All') {
      selector.customerId = customerId;
    }
    if (staffId != 'All') {
      selector.staffId = staffId;
    }
    var lendings = Ice.Collection.Lending.find(selector).fetch()
    lendings.forEach(function (lending) {
      lending.index = index;
      content.push(lending)
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
})
