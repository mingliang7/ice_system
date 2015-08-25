var generateReport, getRank, rangeDate, setOrderGroup;

this.Print = new ReactiveObj();

generateReport = function(id) {
  var doc, q, url;
  doc = Ice.Collection.Order.findOne(id);
  url = "invoiceReportGen?orderId=" + id + "&customerId=" + doc.iceCustomerId + "&date=" + (moment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'));
  return window.open(url, '_blank');
};

generatePayment = function(id){
  setTimeout(function(){
    doc = Ice.Collection.Order.findOne(id)
    alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, doc))
  },200);
}
this.GenReport = generateReport;


updateOrderGroup = function(doc){
  var group, id, orderGroup, prefix, type;
  orderGroup = new OrderGroup(doc);
  iceOrderGroupId = Session.get('iceOrderGroupId');
  oldValue = Session.get('oldOrderValue');
  type = OneRecord.customer(doc.iceCustomerId).customerType;
  if (type !== 'general') {
    date = rangeDate(doc.orderDate, type);
    startDate = date.startDate;
    endDate = date.endDate;
    oldOrder = Ice.Collection.OrderGroup.findOne(iceOrderGroupId);
    doc = checkingOrder(oldOrder, oldValue, doc);
    Ice.Collection.OrderGroup.update({_id: iceOrderGroupId}, {$set: doc});
    doc.iceOrderGroupId = doc._id;      
  } else {
    doc.paidAmount = 0;
    doc.outstandingAmount = doc.total;
    return doc.closing = false;
  }
}
Template.ice_paymentUrlInsertTemplate.events({ // on change for payment popup 
  'click .close': function() {
    window.close()
  },
  'change [name="customerId"]': function(e) {
    var customer;
    customer = $(e.currentTarget).val();
    return Ice.ListForReportState.set('customer', customer);
  },
  'change [name="orderId_orderGroupId"]': function(e) {
    var currentInvoice, currentInvoiceId, type;
    currentInvoiceId = $(e.currentTarget).val();
    datePicker(currentInvoiceId);
    type = Ice.ListForReportState.get('type');
    if (type === 'general') {
      currentInvoice = Ice.Collection.Order.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else {
      currentInvoice = Ice.Collection.OrderGroup.findOne(currentInvoiceId);
      Session.set('oldPaidAmount', currentInvoice.paidAmount);
      $('[name="dueAmount"]').val(currentInvoice.outstandingAmount);
      $('[name="paidAmount"]').val(currentInvoice.outstandingAmount);
      return $('[name="outstandingAmount"]').val(0);
    }
  },
  'keyup [name="paidAmount"]': function() {
    var dueAmount, paidAmount;
    dueAmount = parseInt($('[name="dueAmount"]').val());
    paidAmount = $('[name="paidAmount"]').val();
    if (parseInt(paidAmount) > dueAmount) {
      $('[name="paidAmount"]').val(dueAmount);
      return $('[name="outstandingAmount"]').val(0);
    } else if (paidAmount === '') {
      return $('[name="outstandingAmount"]').val(dueAmount);
    } else {
      return $('[name="outstandingAmount"]').val(dueAmount - parseInt(paidAmount));
    }
  }
});

AutoForm.hooks({
  ice_orderInsertTemplate: {
    before: {
      insert: function(doc) {
        doc.branchId = Session.get('currentBranch');
        if(checkType(doc.iceCustomerId) == 'general'){
          doc.paidAmount = 0;
          doc.outstandingAmount = doc.total;
          doc.closingDate = 'none';
          doc.closing = false;
        }
        return doc;
      }
    },
    after: { // generate report or payment 
      insert: function(err, _id) {
        if (err) {
          Print.set('print', false);
          Print.set('pay', false)
        } else {
          setTimeout(function(){
            checkIfReady();
          }, 1000);
        }
      }
    },
    onSuccess: function(formType, result) {
      $('select').each(function(){
        $(this).select2('val', '');
      });
      Session.set('ice_customer_id', null); //set iceCustomerId to null
      alertify.order().close()
       Loading.set('loadingState', false)
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
      Loading.set('loadingState', false)
      return alertify.error(error.message);
    }
  },
  ice_orderUpdateTemplate: {
    before: {
      update: function(doc){
        if ((doc.$set.orderDate && doc.$set.iceCustomerId && doc.$set.iceOrderDetail) !== void 0) {
          updateOrderGroup(doc.$set);
        }
        return doc;
      }
    },
    onSuccess: function(formType, result) {
      alertify.order().close()
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});


var checkingOrder = function (oldDoc, oldValue, newDoc){ // checking oldOrder when update
  var date = moment(newDoc.orderDate).format('YYYY-MM-DD')
  var total = 0;
  var totalDiscount = 0;
  var totalInDollar = 0;
  for(var k in oldDoc.groupBy['day' + date].items){ // remove items 
    if(oldValue.items[k] != undefined){
      oldDoc.groupBy['day' + date].items[k] = {
        name: oldDoc.groupBy['day' + date].items[k].name,
        price: oldDoc.groupBy['day' + date].items[k].price,
        qty: oldDoc.groupBy['day' + date].items[k].qty -  oldValue.items[k].qty,
        amount: oldDoc.groupBy['day' + date].items[k].amount -  oldValue.items[k].amount,
        discount: oldDoc.groupBy['day' + date].items[k].discount -  oldValue.items[k].discount
      }
    }
  }
  total =  oldDoc.total - oldValue.total
  oldDoc.groupBy['day' + date].discount = oldDoc.groupBy['day' + date].discount - oldValue.discount;
  oldDoc.groupBy['day' + date].total = oldDoc.groupBy['day' + date].total - oldValue.total;
  oldDoc.groupBy['day' + date].totalInDollar = oldDoc.groupBy['day' + date].totalInDollar - oldValue.totalInDollar;
  oldDoc.total = total;
  oldDoc.totalInDollar = oldDoc.totalInDollar - oldValue.totalInDollar;
  oldDoc.discount = oldDoc.discount - oldValue.discount  
  oldDoc.outstandingAmount = total;
  return insertNewDocToOldOrder(oldDoc, newDoc);
}

var insertNewDocToOldOrder = function (oldDoc, newDoc){ //insert a new doc to old order
  order = {};
  order.items = {};
  order.totalInDollar = newDoc.totalInDollar;
  order.total = newDoc.total;
  order.outstandingAmount = newDoc.total;
  order.discount = 0 ;
  if(newDoc.discount != undefined){
    order.discount = newDoc.discount;
  }
  newDoc.iceOrderDetail.forEach(function (item) {
    discount = 0
    if(item.discount != undefined){
      discount = item.discount;
    }
    order.items[item.iceItemId] = {
      qty: item.qty,
      amount: item.amount,
      price: item.price,
      discount: discount
    }
  });

  var date = moment(newDoc.orderDate).format('YYYY-MM-DD')
  for(var k in oldDoc.groupBy['day' + date].items){
    if(order.items[k] != undefined){
      oldDoc.groupBy['day' + date].items[k] = {
        name: oldDoc.groupBy['day' + date].items[k].name,
        price: order.items[k].price,
        qty: oldDoc.groupBy['day' + date].items[k].qty + order.items[k].qty,
        amount: oldDoc.groupBy['day' + date].items[k].amount + order.items[k].amount,
        discount: oldDoc.groupBy['day' + date].items[k].discount + order.items[k].discount
      }
    }
  }
  oldDoc.groupBy['day' + date].discount =  oldDoc.groupBy['day' + date].discount + order.discount;
  oldDoc.groupBy['day' + date].total =  oldDoc.groupBy['day' + date].total + order.total;
  oldDoc.groupBy['day' + date].totalInDollar =  oldDoc.groupBy['day' + date].totalInDollar + order.totalInDollar;
  oldDoc.discount = oldDoc.discount + order.discount;
  oldDoc.total = oldDoc.total + order.total;
  oldDoc.totalInDollar = oldDoc.totalInDollar + order.totalInDollar;
  oldDoc.outstandingAmount = oldDoc.outstandingAmount + order.outstandingAmount;
  return oldDoc;
} 

checkType = function(id){
  return Ice.Collection.Customer.findOne(id).customerType;
}


getRank = function(date, type) {
  obj = {}
  var day, now, range;
  range = undefined;
  day = new Date(date).getDate();
  now = new Date(date);
  range = 31;
  startDate = '';
  endDate = '';
  onFeb = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  for(var i = 1 ; i <= range; i += type ){
    for(var j = i ; j < i + type; j++){
      if(day <= j){
        if(now.getMonth() + 1 == 2){
          if(j + type >= onFeb){
            endDate = moment(now.setDate(onFeb)).format('YYYY-MM-DD');
            break
          }else{
            endDate = moment(now.setDate((i + type) - 1)).format('YYYY-MM-DD');
            break
          }

        }else{
          if(i + type > 40 ){
            lastDate = new Date(now.getFullYear(), now.getMonth() +1,0)
            endDate = moment(lastDate).format('YYYY-MM-DD');
            break
          }else if(i + type >= 26){
            lastDate = new Date(now.getFullYear(), now.getMonth() +1,0)
            endDate = moment(lastDate).format('YYYY-MM-DD');
            break      
          }else{
            endDate = moment(now.setDate((i + type) - 1)).format('YYYY-MM-DD');
            break
          }
        }
      }
    }
    last = moment(endDate).format('DD')
    if(last == '31'){
      setEndDate = parseInt(last) - type;
      startDate = moment(now.setDate(setEndDate)).format('YYYY-MM-DD');
    }else{      
     startDate = moment(now.setDate(i)).format('YYYY-MM-DD');
    }
    if(endDate != '') break;
  }
  return {startDate: startDate, endDate: endDate};
};

rangeDate = function(date, type) {
  switch(type){
    case '5': 
      return getRank(date, 5);
    case '10':  
      return getRank(date, 10);
    case '15':  
      return getRank(date, 15);
    case '20':  
      return getRank(date, 20);
    case '30':  
      return getRank(date, 30);
  }
};


var checkIfReady = function(){
  var id = undefined;
  Meteor.call('getOrderId', arguments, function(err, id){
    if (err) {
      console.log(err);
    }else{
      print = Print.get('print');
      pay = Print.get('pay');
      saveNpay = Print.get('saveNpay');
      if (print === true) {
        generateReport(id);
        return Print.set('print', false);
      }else if (pay == true){
        Print.set('pay', false);
        generatePayment(id);
        Session.set('invioceReportId', id)
      }else if (saveNpay == true){
        Print.set('saveNpay', false);
        generatePayment(id)
      }
    }
  });
}


