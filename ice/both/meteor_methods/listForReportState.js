Meteor.methods({
  getAllCustomer: function () {
    customers = findCustomer();
    return customers;
  },
  customerByType: function (type) {
    var list = [];
    var customerType = type;
    customerType = customerType == undefined ? '' : customerType;
    customers = findCustomerByType(customerType);
    list.push({
      label: "All",
      value: ""
    });
    if (customerType != '') {
      list = customers;
    }
    return list;
  },
  generalCustomer: function (query, options, type) {
    options = options || {};
    var selector = {}
    var regex = new RegExp(query, 'i');
    selector.status = 'enable'
    if (!_.isEmpty(type)) {
      selector.customerType = type;
    }
    selector.$or = [{
      name: {
        $regex: regex
      }
    }, {
      _id: {
        $regex: regex
      }
    }]
    // guard against client-side DOS: hard limit to 50
    if (options.limit) {
      options.limit = Math.min(50, Math.abs(options.limit));
    } else {
      options.limit = 50;
    }

    // TODO fix regexp to support multiple tokens
    return Ice.Collection.Customer.find(
      selector, options).fetch();
  }
});

var findCustomerByType = function (type) {
  arr = [];
  customers = undefined;
  if (type != '') {
    customers = Ice.Collection.Customer.find({
      customerType: type
    });
  } else {
    customers = Ice.Collection.Customer.find();
  }
  arr.push({
    label: 'All',
    value: ''
  });
  customers.forEach(function (customer) {
    arr.push({
      label: '' + customer._id + ' | ' + customer.name,
      value: customer._id
    });
  });
  return arr;
};

var findCustomer = function () {
  arr = [];
  customers = Ice.Collection.Customer.find();
  arr.push({
    label: 'All',
    value: ''
  });
  customers.forEach(function (customer) {
    arr.push({
      label: '' + customer._id + ' | ' + customer.name,
      value: customer._id
    });
  });
  return arr;
};
