Meteor.methods({
	removeOrderPayment: function(doc){
		var oldPaymentDetail = Ice.Collection.Order.findOne(doc.orderId_orderGroupId)._payment;
    delete oldPaymentDetail[doc._id];
    var oldOrder = Ice.Collection.Order.findOne(doc.orderId_orderGroupId);
    if($.isEmptyObject(oldPaymentDetail)){
      Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$unset:{_payment: ''}, $set: {paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false, closingDate: 'none'}});
    }else{
      Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$set: {_payment: oldPaymentDetail, paidAmount: oldOrder.paidAmount - doc.paidAmount, outstandingAmount: doc.paidAmount + doc.outstandingAmount, closing: false, closingDate: 'none'}});
    }
	},
	removeOrderGroupPayment: function(doc) {
		var oldPaymentDetail = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId)._payment;
  delete oldPaymentDetail[doc._id];
   var oldOrder = Ice.Collection.OrderGroup.findOne(doc.orderId_orderGroupId);
  if($.isEmptyObject(oldPaymentDetail)){
    Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId},
              {$unset: {_payment: ''},
                $set:
                {
                  paidAmount: oldOrder.paidAmount - doc.paidAmount,
                  outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                  closing: false, closingDate: 'none'
                }
              });
  }else{
    Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId},
            {
              $set:
              {
                _payment: oldPaymentDetail,
                paidAmount: oldOrder.paidAmount - doc.paidAmount,
                outstandingAmount: doc.paidAmount + doc.outstandingAmount,
                closing: false, closingDate: 'none'
              }
            });
  }
	}
});