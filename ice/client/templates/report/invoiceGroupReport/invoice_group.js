
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

var datePicker = function() {
  var date;
  date = $('[name="date"]');
  DateTimePicker.dateRange(date);
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
            status = status == 'closed' ? true : false
            var selector = {closing: eval(status), startDate: {$gte: startDate}, endDate: {$lte: endDate}};
            var groupOrder = Ice.Collection.OrderGroup.find(selector);
            groupOrder.forEach(function (itemsDetail) {
                contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
            });
            if (content.length > 0) {
                data.content = content;
              
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
            if (content.length > 0) {
                data.content = content;
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }
        }else if (status != 'All' && customerType !== 'All' && customer == 'All'){
            status = status == 'closed' ? true : false
            customers = findCustomerByType(customerType);
            var index = 1;
            for(var i = 0 ; i < customers.length; i++){
                status = status == 'closed' ? true : false
                var selector = {iceCustomerId: customers[i], closing: eval(status), startDate: {$gte: startDate}, endDate: {$lte: endDate}};
                var groupOrder = Ice.Collection.OrderGroup.find(selector);
                if(groupOrder.count() > 0) {
                    groupOrder.forEach(function (itemsDetail) {
                        contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
                    });
                }
                
            }
            if (content.length > 0) {
                data.content = content;
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }
        }else if (status == 'All' && customerType !== 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            for(var i = 0 ; i < customers.length; i++){
                status = status == 'closed' ? true : false
                var selector = {iceCustomerId: customers[i], startDate: {$gte: startDate}, endDate: {$lte: endDate}};
                var groupOrder = Ice.Collection.OrderGroup.find(selector);
                if(groupOrder.count() > 0) {
                    groupOrder.forEach(function (itemsDetail) {
                        contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
                    });
                }
                
            }
            if (content.length > 0) {
                data.content = content;
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }
        }else if (status == 'All' && customerType !== 'All' && customer != 'All'){
            var selector = {iceCustomerId: customer, startDate: {$gte: startDate}, endDate: {$lte: endDate}};
            var groupOrder = Ice.Collection.OrderGroup.find(selector);
            groupOrder.forEach(function (itemsDetail) {
                contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
            });
            if (content.length > 0) {
                data.content = content;
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }

        }else{
            status = status == 'closed' ? true : false
            var selector = {closing: eval(status), iceCustomerId: customer, startDate: {$gte: startDate}, endDate: {$lte: endDate}};
            var groupOrder = Ice.Collection.OrderGroup.find(selector);
            groupOrder.forEach(function (itemsDetail) {
                contentDetail(content, itemsDetail.groupBy, itemsDetail); //function call
            });
            if (content.length > 0) {
                data.content = content;
              
            return data;
            } else {
                data.content.push({index: 'no results'});
                return data;
            }
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
            results += '<tr style="border-bottom: 1px solid #000;">' + '<td>' + items[k]['orderDate'] + '</td>';
            for (var j in items[k]) {
                if(items[k][j].qty != 0){
                    if (items[k][j].name !== undefined && items[k][j].name !== 'ទឹកកកដើម (ដើម)') {
                        results += '<td>' + +items[k][j].qty + 'kg' + '</td>';
                    } else if (items[k][j].name !== undefined && items[k][j].name == 'ទឹកកកដើម (ដើម)') {
                        results += '<td>' + +items[k][j].qty + 'ដើម' + '</td>';
                    }
                }else{
                    results += '<td></td>'
                }
            }
            results += '</tr>'
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

// function which generate each customer order detail included footer and header 
var contentDetail = function (content, itemsDetail, order) {
    var qty = extractTotalQty(itemTotalDetail(itemsDetail));
    var price = extractPrice(itemTotalDetail(itemsDetail));
    var discount = extractDiscount(itemTotalDetail(itemsDetail))
    var dataItem = {};
    dataItem = {};
    dataItem.invoiceId = order._id; 
    dataItem.customerName = findCustomerName(order.iceCustomerId);
    dataItem.total = itemTotalDetail(itemsDetail);
    dataItem.totalDetail = { // total each orderGroup for qty, price, amount
        qty: qty,
        price: price,
        discount: discount,
        amount: extractTotalAmount(itemTotalDetail(itemsDetail))
    } 
    dataItem.footer = { // footer for total in khmer , dollar , paidAmount , oustandingAmount
        total: formatKh(order.total),
        totalInDollar: formatUS(order.totalInDollar),
        paidAmount: formatKh(order.paidAmount),
        discount: formatKh(order.discount),
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
    itemSubTotal.discount = {};
    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] = 0;
            itemSubTotal.amount[i] = 0;
            itemSubTotal.discount[i] = 0;
        }
    }

    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] += itemsDetail[k]['items'][i].qty;
            itemSubTotal.price[i] = itemsDetail[k]['items'][i].price;
            itemSubTotal.discount[i] += itemsDetail[k]['items'][i].discount;
            itemSubTotal.amount[i] += itemsDetail[k]['items'][i].amount;
        }
    }
    return itemSubTotal;
}

var extractTotalQty = function (totalItem) {
    debugger
    var qty = '';
    for (var i in totalItem.qty) {
        if(totalItem.qty[i] != 0 ){ 
            qty += '<td>' + formatUS(totalItem.qty[i]) + '</td>';
        }else{
            qty += '<td></td>';
        }
    }
    return qty;
}
var extractPrice = function (totalItem) {
    var price = '';
    for (var i in totalItem.price) {
        if(totalItem.qty[i] != 0 ){
         price += '<td>' + formatKh(totalItem.price[i]) + '</td>';
        }else{
         price += '<td></td>'
        }
    }
    return price;
}
var extractTotalAmount = function (totalItem) {
    var totalAmount = 0;
    var qty = [];
    var price = [];
    var index = 0
    var amount = '';
    for (var i in totalItem.qty) {
        qty.push(totalItem.qty[i])
    }
    for (var i in totalItem.price) {
        price .push(totalItem.price[i]);
    }
    for (var i in totalItem.amount) {
        if(totalItem.amount[i] != 0){
            if(qty[index] * price[index] != totalItem.amount[i]){
                amount += '<td><u>' + formatKh(totalItem.amount[i]) + '</u></td>';
            }else{
                amount += '<td>' + formatKh(totalItem.amount[i]) + '</td>';
            }
        }else{
            amount += '<td> </td>';
        }
        index++;
    }
    return amount;

}

var extractDiscount = function (totalItem) {
    var discount = '';
    for (var i in totalItem.discount) {
        discount += '<td>' + totalItem.discount[i] + '%' + '</td>';
    }
    return discount;
}

