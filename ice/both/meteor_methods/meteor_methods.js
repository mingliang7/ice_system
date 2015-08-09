// Generated by CoffeeScript 1.4.0

Meteor.methods({
  updatePaid: function(id, cond) {
    if (cond === true) {
      return Ice.Collection.OrderGroup.update({
        _id: id
      }, {
        $set: {
          paid: true
        }
      });
    } else {
      return Ice.Collection.OrderGroup.update({
        _id: id
      }, {
        $set: {
          paid: false
        }
      });
    }
  },
  migrateOrder: function() {
    var countOrder, countPayment, orders;
    countPayment = 0;
    countOrder = 0;
    orders = Ice.Collection.Order.find();
    orders.forEach(function(order) {
      var closingDate, obj, payment, payments;
      if (order.closing !== void 0) {
        if (order.paidAmount !== 0) {
          countOrder += 1;
          payment = {};
          payments = Ice.Collection.Payment.find({
            orderId_orderGroupId: order._id
          }, {
            sort: {
              paymentDate: 1
            }
          });
          payments.forEach(function(obj) {
            countPayment += 1;
            return payment[obj._id] = {
              customerId: obj.customerId,
              staff: obj.staffId,
              date: obj.paymentDate,
              dueAmount: obj.dueAmount,
              paidAmount: obj.paidAmount,
              outstandingAmount: obj.outstandingAmount
            };
          });
          if (order.closing) {
            obj = _.findLastKey(payment, function(payment) {
              return payment;
            });
            try {
              closingDate = payment[obj].date;
            } catch (e) {
              console.log(e);
            }
            return Ice.Collection.Order.update({
              _id: order._id
            }, {
              $set: {
                closingDate: closingDate,
                _payment: payment
              }
            });
          }
        } else {
          return Ice.Collection.Order.update({
            _id: order._id
          }, {
            $set: {
              closingDate: 'none'
            }
          });
        }
      } else {
        if (order.closing !== void 0 && order.closing === false) {
          return Ice.Collection.Order.update({
            _id: order._id
          }, {
            $set: {
              closingDate: 'none'
            }
          });
        }
      }
    });
    return alert("Migrate " + countPayment + " payment to " + countOrder + " order");
  },
  migrateOrderGroup: function() {
    var countOrder, countPayment, orders;
    countPayment = 0;
    countOrder = 0;
    orders = Ice.Collection.OrderGroup.find();
    console.log(orders.count());
    orders.forEach(function(order) {
      var closingDate, obj, payment, payments;
      if (order.paidAmount !== 0) {
        countOrder += 1;
        payment = {};
        payments = Ice.Collection.Payment.find({
          orderId_orderGroupId: order._id
        }, {
          sort: {
            paymentDate: 1
          }
        });
        console.log(payments.count());
        payments.forEach(function(obj) {
          countPayment += 1;
          return payment[obj._id] = {
            customerId: obj.customerId,
            staff: obj.staffId,
            date: obj.paymentDate,
            dueAmount: obj.dueAmount,
            paidAmount: obj.paidAmount,
            outstandingAmount: obj.outstandingAmount
          };
        });
        if (order.closing) {
          obj = _.findLastKey(payment, function(payment) {
            return payment;
          });
          try {
            closingDate = payment[obj].date;
          } catch (e) {
            console.log(e);
          }
          return Ice.Collection.OrderGroup.update({
            _id: order._id
          }, {
            $set: {
              closingDate: closingDate,
              _payment: payment
            }
          });
        } else {
          return Ice.Collection.OrderGroup.update({
            _id: order._id
          }, {
            $set: {
              closingDate: 'none'
            }
          });
        }
      } else {
        return Ice.Collection.OrderGroup.update({
          _id: order._id
        }, {
          $set: {
            closingDate: 'none'
          }
        });
      }
    });
    return alert("Migrate " + countPayment + " payment to " + countOrder + " order");
  },
  removeMigrateFromOrder: function() {
    var count, orders;
    orders = Ice.Collection.Order.find();
    count = 0;
    orders.forEach(function(order) {
      if (order.closingDate !== void 0) {
        Ice.Collection.Order.update({
          _id: order._id
        }, {
          $unset: {
            closingDate: '',
            _payment: ''
          }
        });
        return count += 1;
      }
    });
    return alert(count + ' payments' + ' removed from order');
  },
  orderReport: function (params) {
  			console.log(params);
        var self = params;
        var data = {
            title: {},
            header: {},
            content: [],
            footer: {}
        };


        /********* Header ********/
        customerType = self.customerType == '' ? 'All' : self.customerType
        customer = self.customerId == '' ? 'All' : self.customerId 
        staff = self.staffId == '' ? 'All' : self.staffId 
        data.header = {
            staff: staff == 'All' ? staff : findStaff(self.staffId),
            customerType: customerType,
            customer: customer,
            date: self.date,
            exchange: formatEx(self.exchange)
        }
        /********* title *********/
         var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.enName,
            address: company.khAddress,
            telephone: company.telephone
        };
        /********** Content **********/
        var content = [];
        var selector = {};
        date = self.date.split(' To ');
        startDate = date[0];
        endDate = date[1];
        if(staff != 'All' && customerType == 'All' && customer == 'All'){
            selector = {iceStaffId: self.staffId, orderDate: {$gte: startDate, $lte: endDate}}
            var getOrder = Ice.Collection.Order.find(selector, {sort: {_id: 1}});
            getOrder.forEach(function (obj) {
                // Do something
                content.push(obj);
            });
        }else if (staff == 'All' && customerType == 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            var index = 1;
            for(var i = 0 ; i < customers.length; i++){
               selector = {iceCustomerId: customers[i], orderDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Order.find(selector, {sort: {_id: 1}});
                getOrder.forEach(function (obj) {
                    obj.index = index;
                    content.push(obj);
                });
            }
        }else if (staff != 'All' && customerType !== 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            var index = 1;
            for(var i = 0 ; i < customers.length; i++){
               selector = {iceStaffId: self.staffId, iceCustomerId: customers[i], orderDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Order.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                });
            }
        }else if (staff == 'All' && customerType !== 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            var index = 1;
            for(var i = 0 ; i < customers.length; i++){
               selector = {iceCustomerId: customers[i], orderDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Order.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                });
            }
        }else if (staff == 'All' && customerType !== 'All' && customer != 'All'){
               selector = {iceCustomerId: self.customerId, orderDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Order.find(selector);
                var index = 1;
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                });
        }else{
                index = 1 ;
                selector = {iceStaffId: self.staffId, iceCustomerId: self.customerId, orderDate: {$gte: startDate, $lte: endDate}};
                getOrder = Ice.Collection.Order.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                });
        }
        if (content.length > 0) {
            var index = 1 
            var sortContent = content.sort(compare);
            sortContent.forEach(function(elem) {
                elem.index = index;
                index++;
            });
            data.content = sortContent;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});


// methods
findStaff = function(id){
    return Ice.Collection.Staffs.findOne(id).name;
}

sortItems = function(orderDetail){
    td = ""
    listItem = {};
    items = Ice.Collection.Item.find()
    count = 0;
    items.forEach(function (item) {
        listItem[item._id] = item;
        listItem[item._id].qty = 0;
        listItem[item._id].amount = 0;

    });
    orderDetail.forEach(function (order) {
        listItem[order.iceItemId] = {qty: listItem[order.iceItemId].qty += order.qty, price: order.price, amount: listItem[order.iceItemId].amount += order.amount}
    });
    // display all items
    for(var k in listItem){
        td += '<td>' + formatQty(listItem[k].qty) + '</td>' + '<td>' + formatKh(listItem[k].price) + '</td>' + '<td>' + formatKh(listItem[k].amount) + '</td>'
    }
    return td; 
}

formatKh = function(val){
    debugger
    return numeral(val).format('0,0')
}
formatUS = function(val){
    return numeral(val).format('0,0.00');
}
formatEx = function(id){
    exchange = Cpanel.Collection.Exchange.findOne(id)
    return exchange.base == 'KHR' ? JSON.stringify(exchange.rates) : '';
}

formatQty = function(val){
    return numeral(val).format('0.0');
}
findCustomerByType = function(type){
   arr = [] 
   customers = undefined;
   if(type != 'All'){
      customers = Ice.Collection.Customer.find({customerType: type})
   }else{
      customers = Ice.Collection.Customer.find()
   }
   customers.forEach(function (customer) {
      arr.push(customer._id);
   });
   return arr;
}
function compare(a,b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}
