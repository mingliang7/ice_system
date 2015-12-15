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
  generalCustomer: function () {
    var list = [];
    var customers = Ice.Collection.Customer.find({
      customerType: 'general',
      status: 'enable'
    });
    list.push({
      label: "(Select One)",
      value: ""
    });
    customers.forEach(function (customer) {
      list.push({
        label: '' + customer._id + ' | ' + customer.name + '(' +
          customer.customerType + ')',
        value: customer._id
      });
    });
    return list;
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
