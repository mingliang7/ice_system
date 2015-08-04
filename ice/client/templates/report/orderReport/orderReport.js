// sort function
function compare(a,b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}

Template.ice_orderReport.onRendered(function() {
  datePicker();
});

Template.ice_orderReport.events({
  'change [name="staffId"]': function(e){
    value = $(e.currentTarget).val();
    return Ice.ListForReportState.set('staffId', value);
  },
  'change [name="customerType"]': function(e) {
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
Template.ice_orderReportGen.helpers({
    data: function () {
        var self = this;
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
    },
    name: function(id){
        customer = Ice.Collection.Customer.findOne(id);
        return customer.name + ' ('+ customer.customerType + ')'
    },
    staffName: function(id){
        console.log(id);
        return Ice.Collection.Staffs.findOne(id).name;
    },
    itemDetail: function(orderDetail){
        return sortItems(orderDetail);
    },
    check: function(value, total){
        return value == undefined ? total : formatKh(value)
    },
    totalDiscount: function(content){
        var discount = 0;
        content.forEach(function(item){
            if(item.discount != undefined){
                discount += item.discount;
            }
        });
        return '<td><strong>' + formatKh(discount) + '</strong></td>' + '<td></td><td></td>';
    },
    sumTotal: function(content){
        td = ''
        total = 0 ;
        outstandingAmount = 0;
        paidAmount = 0 
        content.forEach(function (item) {
            if(item.paidAmount == undefined ){
                paidAmount += 0
                outstandingAmount += item.total
                total += item.total
            }else{
                total += item.total
                paidAmount += item.paidAmount
                outstandingAmount += item.outstandingAmount
            }
        });
        return '<td>' + '<strong>' + formatKh(total) + '</strong' + '</td>' + '<td>' + '<strong>' + formatKh(paidAmount) + '</strong' + '</td>' + '<td>' +'<strong>' + formatKh(outstandingAmount) + '</strong>' + '</td>';
    },
    formatCurrency: function(value){
        return formatKh(value);
    },
    totalInDollar: function(content){
        td = ''
        total = 0 ;
        outstandingAmount = 0;
        paidAmount = 0
        content.forEach(function (item) {
            dollar = JSON.parse(formatEx(item.exchange)).USD;
            if(item.paidAmount == undefined ){
                paidAmount += 0
                outstandingAmount += (item.total * parseFloat(dollar))
                 total += (item.total * parseFloat(dollar))
            }else{
                total += (item.total * parseFloat(dollar))
                paidAmount += (item.paidAmount * parseFloat(dollar))
                outstandingAmount += (item.outstandingAmount * parseFloat(dollar))
            }
        });
        return '<td>' + '<strong>' + formatUS(total) + '</strong>'+'</td>' + '<td>' + '<strong>' + formatUS(paidAmount) + '</strong>'+'</td>' + '<td>' + '<strong>' + formatUS(outstandingAmount) + '</td>';
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
