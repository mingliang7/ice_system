Ice.Collection.Order.before.insert(function (userId, doc){
  var prefix = doc.branchId + '-';
  doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
  StateId.set({orderId: doc._id})
});

Ice.Collection.Order.before.update(function(userId, doc, fieldNames, modifier,options){
  modifier.$set = modifier.$set || {};
  if(modifier.$set.iceOrderDetail){
    var iceOrderDetail = [];
    _.each(modifier.$set.iceOrderDetail, function(obj){
      if (!_.isNull(obj)){
        iceOrderDetail.push(obj);
      }
    });
    modifier.$set.iceOrderDetail = iceOrderDetail;
  }
});
Ice.Collection.Order.before.remove(function (userId, doc) {
  if(doc.iceOrderGroupId != undefined){
    var order = {};
    var oldDoc = Ice.Collection.OrderGroup.findOne(doc.iceOrderGroupId);
    var orderDate = moment(doc.orderDate).format('YYYY-MM-DD');
    order.items = {};
    order.total = doc.total;
    order.totalInDollar = doc.totalInDollar;
    order.discount = 0 ; 
    if(doc.discount != undefined){
      order.discount = doc.discount;
    }
    doc.iceOrderDetail.forEach(function(item) {
      var discount = 0 ;
      if(item.discount != undefined) {
        discount = item.discount;
      }
      order.items[item.iceItemId] = {
        qty: item.qty,
        amount: item.amount,
        price: item.price,
        discount: discount
      };
    });
    doc = removeOrderGroup(oldDoc, order, orderDate); 
    console.log(doc)
    if(doc.total == 0) {
      Ice.Collection.OrderGroup.remove(oldDoc._id)
    }else{
      Ice.Collection.OrderGroup.update(oldDoc._id, {$set: doc});
    }
  }
});

var removeOrderGroup = function (oldDoc, oldValue, orderDate){ // oldDoc is old order group value and oldValue is order old value 
  var date = orderDate;
  var total = 0;
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
  oldDoc.groupBy['day' + date].total = oldDoc.groupBy['day' + date].total - oldValue.total;
  oldDoc.groupBy['day' + date].discount = oldDoc.groupBy['day' + date].discount - oldValue.discount;
  oldDoc.groupBy['day' + date].totalInDollar = oldDoc.groupBy['day' + date].totalInDollar - oldValue.totalInDollar;
  oldDoc.total = total;
  oldDoc.totalInDollar = oldDoc.totalInDollar - oldValue.totalInDollar;
  oldDoc.discount = oldDoc.discount - oldValue.discount;
  oldDoc.outstandingAmount = total;
  if(oldDoc.groupBy['day' + date].total == 0 ){
    delete oldDoc.groupBy['day' + date];
  }
  return oldDoc;
}