
Template.ice_staffReport.onRendered(function() {
  datePicker();
});

Template.ice_staffReport.events({
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
Template.ice_staffReportGen.helpers({
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
        data.header = {
            staff: findStaff(self.staffId),
            customerType: customerType,
            customer: customer,
            date: self.date
        }

        /********** Content **********/
        var content = [];
        var selector = {};
        date = self.date.split(' To ');
        startDate = date[0];
        endDate = date[1];
        if(customerType == 'All' && customer == 'All'){
            selector = {iceStaffId: self.staffId, orderDate: {$gte: startDate, $lte: endDate}}
            var getOrder = Ice.Collection.Order.find(selector);
            var index = 1;
            getOrder.forEach(function (obj) {
                // Do something
                obj.index = index;
                content.push(obj);
                index++;
            });
        }else if (customerType !== 'All' && customer == 'All'){
            customers = findCustomerByType(customerType);
            for(var i = 0 ; i < customers.length; i++){
               selector = {iceStaffId: self.staffId, iceCustomerId: customers[i], orderDate: {$gte: startDate, $lte: endDate}}
                var getOrder = Ice.Collection.Order.find(selector);
                var index = 1;
                getOrder.forEach(function (obj) {
                    // Do something
                    obj.index = index;
                    content.push(obj);
                    index++;
                });
            }
        }
            debugger
        
        

        if (content.length > 0) {
            data.content = content;

            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },
    name: function(id){
        return Ice.Collection.Customer.findOne(id).name;
    },
    itemDetail: function(orderDetail){
        return sortItems(orderDetail);
    },
    check: function(value){
        return value == undefined ? 'ប្រភេទ Group' : formatKh(value)
    }
});

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
    for(var k in listItem){
        td += '<td>' + listItem[k].qty + '</td>' + '<td>' + listItem[k].price + '</td>' + '<td>' + listItem[k].amount + '</td>'
    }
    return td; 
}

formatKh = function(val){
    return numeral(val).format('0,0')
}

var findCustomerByType = function(type){
   arr = [] 
   customers = undefined;
   if(type != ''){
      customers = Ice.Collection.Customer.find({customerType: type})
   }else{
      customers = Ice.Collection.Customer.find()
   }
   customers.forEach(function (customer) {
      arr.push(customer._id);
   });
   return arr;
}