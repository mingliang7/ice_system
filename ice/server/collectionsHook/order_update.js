Ice.Collection.Order.after.update(function(userId, doc){
  var preDoc = this.previous;
  Meteor.defer(function(){
    Meteor._sleepForMs(1000);
    updateOrderGroup(preDoc, doc)
  });
});
updateOrderGroup = function(preDoc, doc){
  var group, id, orderGroup, prefix, type;
  orderGroup = new OrderGroup(doc);
  iceOrderGroupId = preDoc.iceOrderGroupId;
  oldData = preDoc;
  type = preDoc._customer.customerType;
  if (type !== 'general') {
    date = rangeDate(doc.orderDate, type);
    startDate = date.startDate;
    endDate = date.endDate;
    oldOrder = Ice.Collection.OrderGroup.findOne(iceOrderGroupId);
    doc = checkingOrder(oldOrder, oldData, doc);
    return Ice.Collection.OrderGroup.update({_id: iceOrderGroupId}, {$set: doc});
  }
}

var checkingOrder = function (oldDoc, data, newDoc){ // checking oldOrder when update
  order = {};
  order.items = {};
  order.discount = 0;
  if (data.discount !== undefined) {
    order.discount = data.discount;
  }
  order.total = data.total;
  order.totalInDollar = data.totalInDollar;
  data.iceOrderDetail.forEach(function(item) {
    var discount;
    if (item.discount !== undefined) {
      discount = item.discount;
    }else{
      discount = 0;
    }
    order.items[item.iceItemId] = {
      qty: item.qty,
      amount: item.amount,
      price: item.price,
      discount: discount
    };
    console.log(discount);
  });
  oldValue = order;
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
