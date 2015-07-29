var generateReport, getRank, rangeDate, setOrderGroup;

this.Print = new ReactiveObj();

generateReport = function(id) {
  var doc, q, url;
  doc = Ice.Collection.Order.findOne(id);
  url = "invoiceReportGen?orderId=" + id + "&customerId=" + doc.iceCustomerId + "&date=" + (moment(doc.createdAt).format('YYYY-MM-DD hh:mm:ss a'));
  return window.open(url, '_blank');
};

generatePayment = function(id){
  doc = Ice.Collection.Order.findOne(id)
  alertify.paymentPopUP(fa('money', 'Payment'), renderTemplate(Template.ice_paymentUrlInsertTemplate, doc))
}
this.GenReport = generateReport;
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
  				debugger
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
  	startDate = moment(now.setDate(i)).format('YYYY-MM-DD');
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

setOrderGroup = function(doc) {
  var group, id, orderGroup, prefix, type;
  orderGroup = new OrderGroup(doc);
  type = OneRecord.customer(doc.iceCustomerId).customerType;
  if (type !== 'general') {
    date = rangeDate(doc.orderDate, type);
    startDate = date.startDate
    endDate = date.endDate
    group = OneRecord.findOrderGroupActiveDate(doc.iceCustomerId, startDate, endDate);
    if (group === void 0 || group === null) {
      prefix = "" + (Session.get('currentBranch')) + "-";
      id = idGenerator.genWithPrefix(Ice.Collection.OrderGroup, prefix, 12);
      return orderGroup.whenNoActiveDate(id, startDate, endDate);
    } else {
      return orderGroup.whenActiveDate(group);
    }
  } else {
    doc.paidAmount = 0;
    doc.outstandingAmount = doc.total;
    return doc.closing = false;
  }
};

updateOrderGroup = function(doc){
  var group, id, orderGroup, prefix, type;
  orderGroup = new OrderGroup(doc);
  iceOrderGroupId = Session.get('iceOrderGroupId');
  oldValue = Session.get('oldOrderGroupValue');
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
        var prefix;
        doc.createdAt = new Date();
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
        doc.branchId = Session.get('currentBranch');
        if ((doc.orderDate && doc.iceCustomerId && doc.iceOrderDetail) !== void 0) {
          setOrderGroup(doc);
        }
        return doc;
      }
    },
    after: { // generate report or payment 
      insert: function(err, id) {
        if (err) {
          Print.set('print', false);
          Print.set('pay', false)
        } else {
          print = Print.get('print');
          pay = Print.get('pay')
          debugger
          if (print === true) {
            generateReport(id);
            return Print.set('print', false);
          }else if (pay == true){
            generatePayment(id);
            return Print.set('print', false);
          }
        }
      }
    },
    onSuccess: function(formType, result) {
      $('select').each(function(){
        $(this).select2('val', '');
      });
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
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
  var totalInDollar = 0;
  for(var k in oldDoc.groupBy['day' + date].items){ // remove items 
    if(oldValue.items[k] != undefined){
      oldDoc.groupBy['day' + date].items[k] = {
        name: oldDoc.groupBy['day' + date].items[k].name,
        price: oldDoc.groupBy['day' + date].items[k].price,
        qty: oldDoc.groupBy['day' + date].items[k].qty -  oldValue.items[k].qty,
        amount: oldDoc.groupBy['day' + date].items[k].amount -  oldValue.items[k].amount
      }
    }
  }
  total =  oldDoc.total - oldValue.total
  oldDoc.groupBy['day' + date].total = oldDoc.groupBy['day' + date].total - oldValue.total;
  oldDoc.groupBy['day' + date].totalInDollar = oldDoc.groupBy['day' + date].totalInDollar - oldValue.totalInDollar;
  oldDoc.total = total;
  oldDoc.totalInDollar = oldDoc.totalInDollar - oldValue.totalInDollar;
  oldDoc.outstandingAmount = total;
  oldDoc.outstandingAmount = total;
  return insertNewDocToOldOrder(oldDoc, newDoc);
}

var insertNewDocToOldOrder = function (oldDoc, newDoc){ //insert a new doc to old order
  order = {};
  order.items = {};
  order.totalInDollar = newDoc.totalInDollar;
  order.total = newDoc.total;
  order.outstandingAmount = newDoc.total;
  newDoc.iceOrderDetail.forEach(function (item) {
    order.items[item.iceItemId] = {
      qty: item.qty,
      amount: item.amount,
      price: item.price
    }
  });

  var date = moment(newDoc.orderDate).format('YYYY-MM-DD')
  for(var k in oldDoc.groupBy['day' + date].items){
    if(order.items[k] != undefined){
      oldDoc.groupBy['day' + date].items[k] = {
        name: oldDoc.groupBy['day' + date].items[k].name,
        price: order.items[k].price,
        qty: oldDoc.groupBy['day' + date].items[k].qty + order.items[k].qty,
        amount: oldDoc.groupBy['day' + date].items[k].amount + order.items[k].amount
      }
    }
  }
  oldDoc.groupBy['day' + date].total =  oldDoc.groupBy['day' + date].total + order.total;
  oldDoc.groupBy['day' + date].totalInDollar =  oldDoc.groupBy['day' + date].totalInDollar + order.totalInDollar;
  oldDoc.total = oldDoc.total + order.total;
  oldDoc.totalInDollar = oldDoc.totalInDollar + order.totalInDollar;
  oldDoc.outstandingAmount = oldDoc.outstandingAmount + order.outstandingAmount;
  return oldDoc;
} 