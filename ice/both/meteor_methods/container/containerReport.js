Meteor.methods({
  containerReport: function (params) {
    this.unblock();
    var self = params;
    var data = {
      title: {},
      header: {},
      content: [],
      footer: {}
    };


    /********* Header ********/
    status = self.status == '' ? 'All' : self.status;
    var company = Cpanel.Collection.Company.findOne();
    data.title = {
      company: company.enName,
      address: company.khAddress,
      telephone: company.telephone
    };
    data.header = {
      date: self.importDate,
      status: status,
    };
    /********** Content **********/
    var content = [];
    var selector = {};
    var broken = 0;
    var available = 0;
    var unavailable = 0;
    var index = 1;
    var total;
    var totalPrice = 0;
    date = self.importDate.split(' To ');
    startDate = date[0];
    addOneDay = moment(date[1]).add(1, 'days')
    endDate = moment(addOneDay._d).format('YYYY-MM-DD HH:mm:ss');
    selector.importDate = {
      $gte: startDate,
      $lt: endDate
    }
    if (status != 'All') {
      selector.status = status;
    }
    var containers = Ice.Collection.Container.find(selector).fetch()
    containers.forEach(function (container) {
      totalPrice += container.price;
      if (container.status == 'Broken') {
        broken++;
      }
      if (container.status == 'Available') {
        available++;
      }
      if (container.status == 'Unavailable') {
        unavailable++;
      }
      container.index = index;
      content.push(container)
      index++;
    })
    total = broken + available + unavailable;
    if (content.length > 0) {
      data.content = content;
      data.footer = {
        broken: broken,
        available: available,
        unavailable: unavailable,
        total: total,
        totalPrice: totalPrice
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
