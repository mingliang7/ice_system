Meteor.startup(function() {
  Ice.Collection.Order._ensureIndex({
    orderDate: 1,
    iceCustomerId: 1,
    iceStaffId: 1,
    closing: 1,
    closingDate: 1
  });
  Ice.Collection.Payment._ensureIndex({
    customerId: 1,
    orderId_orderGroupId: 1,
    paymentDate: 1,
    status: 1,
    staffId: 1
  });
  Ice.Collection.OrderGroup._ensureIndex({
    startDate: 1,
    endDate: 1,
    iceCustomerId: 1,
    closing: 1,
    closingDate: 1
  });
});
