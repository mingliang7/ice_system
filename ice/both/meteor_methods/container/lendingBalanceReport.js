Meteor.methods({
  lendingBalanceReport: function (params) {
    this.unblock();
    var self = params;
    var data = {
      title: {},
      header: {},
      content: [],
      footer: {}
    };


    /********* Header ********/
    staffId = self.staffId == '' ? 'All' : self.staffId;
    type = self.type == '' ? 'All' : self.type
    var company = Cpanel.Collection.Company.findOne();
    data.title = {
      company: company.enName,
      address: company.khAddress,
      telephone: company.telephone
    };
    data.header = {
      date: self.date,
      staff: staffId
    };
    /********** Content **********/
    var content = [];
    var selector = {};
    var index = 1;
    var total = 0;
    addOneDay = moment(self.date).add(1, 'days')
    date = moment(addOneDay._d).format('YYYY-MM-DD HH:mm:ss');
    selector.lendingDate = {
      $lt: date
    };
    if (type != 'All') {
      selector.lendingType = type
    }
    if (staffId != 'All') {
      selector.staffId = staffId;
    }
    var lendings = Ice.Collection.Lending.find(selector).fetch()
    lendings.forEach(function (lending) {
      lending.index = index;
      var reduceContainers = [];
      var containers = lending.containers;
      containers.forEach(function (container) {
        if (!_.isUndefined(container.returnDate) && container.returnDate >
          date) {
          reduceContainers.push(container);
        } else if (_.isUndefined(container.returnDate)) {
          reduceContainers.push(container)
        }
      })
      lending.containers = reduceContainers;
      lending.count = lending.containers.length
      total += lending.count
      content.push(lending)
      index++;
    })
    if (content.length > 0) {
      data.content = content;
      data.footer = {
        total: total
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
