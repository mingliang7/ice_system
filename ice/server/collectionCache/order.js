Ice.Collection.Order.cacheDoc('customer', Ice.Collection.Customer, ['name', 'customerType'],{
	refField: 'iceCustomerId'
});
Ice.Collection.Order.cacheDoc('staff', Ice.Collection.Staffs, ['name', 'customerType'],{
	refField: 'iceStaffId'
});

