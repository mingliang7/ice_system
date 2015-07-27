
Template.ice_invoiceGroup.onRendered(function() {
  datePicker();
});

Template.ice_invoiceGroup.events({
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
Template.ice_invoiceGroupGen.helpers({
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
        status = self.status == '' ? 'All' : self.status
        data.header = {
            date: self.date,
            customerType: customerType,
            customer: customer
        }
        /********** Content **********/
        var content = [];
        var selector = {};
        date = self.date.split(' To ');
        startDate = date[0];
        endDate = date[1];
        if(status != 'All' && customerType == 'All' && customer == 'All'){
            var selector = {orderDate: {$gte: startDate, $lte: endDate}};
            var groupOrder = Ice.Collection.OrderGroup.find(selector);
            groupOrder.forEach(function (itemsDetail) {
                contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
            });
            debugger
            if (content.length > 0) {
                data.content = content;

                data.footer = {
                    // subtotal: formatNum(groupOrder.subtotal),
                    // discount: groupOrder.discount == undefined ? '' : groupOrder.discount + '%',
                    total: formatKhmerCurrency(groupOrder.total),
                    totalInDollar: formatNum(groupOrder.totalInDollar),
                    paidAmount: formatKhmerCurrency(groupOrder.paidAmount),
                    outstandingAmount: formatKhmerCurrency(groupOrder.outstandingAmount)
                }
                data.totalDetail = {
                    qty: extractTotalQty(totalItem),
                    price: extractPrice(totalItem),
                    amount: extractTotalAmount(data.footer.total, totalItem)
                }
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }

        }else if (status == 'All' && customerType == 'All' && customer == 'All'){
            var selector = {startDate: {$gte: startDate}, endDate: {$lte: endDate}};
            var groupOrder = Ice.Collection.OrderGroup.find(selector);
            groupOrder.forEach(function (itemsDetail) {
                contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
            });
            debugger
            if (content.length > 0) {
                data.content = content;
                data.footer = {
                    // subtotal: formatNum(groupOrder.subtotal),
                    // discount: groupOrder.discount == undefined ? '' : groupOrder.discount + '%',
                    total: formatKh(groupOrder.total),
                    totalInDollar: formatUS(groupOrder.totalInDollar),
                    paidAmount: formatKh(groupOrder.paidAmount),
                    outstandingAmount: formatKh(groupOrder.outstandingAmount)
                }
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }
        }else if (staff != 'All' && customerType !== 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            var index = 1;
            for(var i = 0 ; i < customers.length; i++){
               selector = {staffId: self.staffId, customerId: customers[i], paymentDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Payment.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                    index++;
                });
            }
        }else if (staff == 'All' && customerType !== 'All' && customer == 'All'){
            var index = 1;
            customers = findCustomerByType(customerType);
            for(var i = 0 ; i < customers.length; i++){
               selector = {customerId: customers[i], paymentDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Payment.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                    index++;
                });
            }
        }else if (staff == 'All' && customerType !== 'All' && customer != 'All'){
               selector = {customerId: self.customerId, paymentDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Payment.find(selector);
                var index = 1;
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                    index++;
                });
        }else{
                index = 1 ;
                selector = {staffId: self.staffId, customerId: self.customerId, paymentDate: {$gte: startDate, $lte: endDate}};
                getOrder = Ice.Collection.Payment.find(selector);
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                    index++;
                });
        }
        if (content.length > 0) {
            data.content = content;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },

    itemName: function (id) {
        var name = Ice.Collection.Item.findOne(id).name;
        return name;
    },
    itemDiscount: function (discount) {
        if (discount == undefined) {
            return '';
        } else {
            return discount;
        }
    },
    listItems: function (items) {
      var results = '';
        for (var k in items) {
            results += '<tr>' + '<td>' + items[k]['orderDate'] + '</td>';
            for (var j in items[k]) {
                if (items[k][j].name !== undefined && items[k][j].name !== 'ទឹកកកដើម (ដើម)') {
                    results += '<td>' + +items[k][j].qty + 'kg' + '</td>';
                } else if (items[k][j].name !== undefined && items[k][j].name == 'ទឹកកកដើម (ដើម)') {
                    results += '<td>' + +items[k][j].qty + 'ដើម' + '</td>';
                }
            }
        }
        return results;
    }
   
});

// methods
findStaff = function(id){
    return Ice.Collection.Staffs.findOne(id).name;
}


formatKh = function(val){
    return numeral(val).format('0,0')
}
formatUS = function(val){
    return numeral(val).format('0,0.00');
}
var formatEx = function(id){
    exchange = Cpanel.Collection.Exchange.findOne(id)
    return  JSON.stringify(exchange.rates) ;
}

var formatQty = function(val){
    return numeral(val).format('0.0');
}
var findCustomerByType = function(type){
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

var findCustomerName = function(id){
    return Ice.Collection.Customer.findOne(id).name;
}

// function which generate each customer order detail
var contentDetail = function (content, itemsDetail, order) {
    var dataItem = {};
    dataItem = {};
    dataItem.invoiceId = order._id; 
    dataItem.customerName = findCustomerName(order.iceCustomerId);
    dataItem.total = itemTotalDetail(itemsDetail);
    dataItem.totalDetail = {
        qty: extractTotalQty(itemTotalDetail(itemsDetail)),
        price: extractPrice(itemTotalDetail(itemsDetail)),
        amount: extractTotalAmount(itemTotalDetail(itemsDetail))
    }
    dataItem.footer = {
        total: formatKh(order.total),
        totalInDollar: formatUS(order.totalInDollar),
        paidAmount: formatKh(order.paidAmount),
        outstandingAmount: formatKh(order.outstandingAmount)
    }
    var company = Cpanel.Collection.Company.findOne();
    dataItem.title = {
        company: company.khName,
        address: company.khAddress,
        telephone: company.telephone
    };
    dataItem.header = [
            {col1: '#: ' + order._id, col2: 'អតិថិជន: ' + order._customer.name},
            {col1: 'កាលបរិច្ឆេទ: ' + order.startDate +" ដល់ " + order.endDate, col2: 'ប្រភេទ: ' + order._customer.customerType},
    ];
    dataItem['items'] = {};
    var orderDay = '';
    for (var k in itemsDetail) {
        orderDay = k.slice(3);
        for (var i in itemsDetail[k]['items']) {
            if (dataItem['items'][orderDay] == undefined) {
                dataItem['items'][orderDay] = {};
                dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                dataItem['items'][orderDay].orderDate = orderDay;
            } else {
                dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                dataItem['items'][orderDay].orderDate = orderDay;
            }
        }
        dataItem['items'][orderDay].total = itemsDetail[k].total;
        dataItem['items'][orderDay].totalInDollar = itemsDetail[k].totalInDollar;
    }
    return content.push(dataItem);
}


var itemTotalDetail = function (itemsDetail) {
    var itemSubTotal = {};
    itemSubTotal.qty = {};
    itemSubTotal.price = {}
    itemSubTotal.amount = {};
    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] = 0;
            itemSubTotal.amount[i] = 0;
        }
    }

    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] += itemsDetail[k]['items'][i].qty;
            itemSubTotal.price[i] = itemsDetail[k]['items'][i].price
            itemSubTotal.amount[i] += itemsDetail[k]['items'][i].amount
        }
    }
    return itemSubTotal;
}

var extractTotalQty = function (totalItem) {
        debugger
    var qty = '';
    for (var i in totalItem.qty) {
        qty += '<td>' + formatUS(totalItem.qty[i]) + '</td>';
    }
    return qty;
}
var extractPrice = function (totalItem) {
    var price = '';
    for (var i in totalItem.price) {
        price += '<td>' + formatKh(totalItem.price[i]) + '</td>';
    }
    return price;
}
var extractTotalAmount = function (totalItem) {
    var amount = '';
    for (var i in totalItem.amount) {
        amount += '<td>' + formatKh(totalItem.amount[i]) + '</td>';
    }
    // amount += '<td>' + '<strong>' + total + '</strong>' + '</td>'
    return amount;
}
