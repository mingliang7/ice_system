Ice.Collection.Order.before.remove(function (userId, doc) {
  if(doc.iceOrderGroupId != undefined){
    var order = {};
    var oldDoc = Ice.Collection.OrderGroup.findOne(doc.iceOrderGroupId);
    var orderDate = moment(doc.orderDate).format('YYYY-MM-DD');
    order.items = {};
    order.total = doc.total;
    order.totalInDollar = doc.totalInDollar;
    doc.iceOrderDetail.forEach(function(item) {
      order.items[item.iceItemId] = {
        qty: item.qty,
        amount: item.amount,
        price: item.price
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
  return oldDoc;
}