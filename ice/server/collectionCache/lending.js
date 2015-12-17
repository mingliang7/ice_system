Ice.Collection.Lending.cacheDoc('customer', Ice.Collection.Customer, ['name',
  'telephone', 'additionalInfo', 'description', 'gender'
], {
  refField: 'customerId'
});

Ice.Collection.Lending.cacheDoc('staff', Ice.Collection.Staffs, ['name',
  'telephone', 'address'
], {
  refField: 'staffId'
});
