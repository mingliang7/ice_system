Ice.Collection.Order.after.insert(function(userId, doc){
  Meteor.defer(function(){
    doc.createdAt = new Date();
    doc.branchId = '001';
		setOrderGroup(doc);
  });  
});


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
	      prefix =  "001-";
	      id = idGenerator.genWithPrefix(Ice.Collection.OrderGroup, prefix, 12);
	      return orderGroup.whenNoActiveDate(id, startDate, endDate);
	    } else {
	      return orderGroup.whenActiveDate(group);
	    }
  } 
};