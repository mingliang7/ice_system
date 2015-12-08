Ice.Collection.Returning.cacheDoc('customer', Ice.Collection.Customer, ['name',
  'telephone', 'address', 'description'
], {
  refField: 'customerId'
});

Ice.Collection.Returning.cacheDoc('staff', Ice.Collection.Staffs, ['name',
  'telephone', 'address'
], {
  refField: 'staffId'
});
