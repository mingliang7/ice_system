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
  url = "payment_url?id=" + id + "&customerId=" + doc.iceCustomerId + "&paidAmount=" + doc.paidAmount + "&outstandingAmount=" + doc.outstandingAmount + "&dueAmount=" + doc.outstandingAmount;
  window.open(url)
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
  					endDate = moment(now.setDate(30)).format('YYYY-MM-DD');
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

AutoForm.hooks({
  ice_orderInsertTemplate: {
    before: {
      insert: function(doc) {
        var prefix;
        doc.createdAt = new Date();
        prefix = "" + (Session.get('currentBranch')) + "-";
        doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
        doc.cpanel_branchId = Session.get('currentBranch');
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
      alertify.order().close();
      return alertify.success('Successfully');
    },
    onError: function(formType, error) {
      return alertify.error(error.message);
    }
  }
});
