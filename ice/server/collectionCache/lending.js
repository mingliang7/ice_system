Ice.Collection.Lending.cacheDoc('customer', Ice.Collection.Customer, ['name',
  'telephone', 'age', 'national', 'citizenship', 'village', 'commune',
  'district', 'province', 'description', 'gender'
], {
  refField: 'customerId'
});

Ice.Collection.Lending.cacheDoc('staff', Ice.Collection.Staffs, ['name',
  'telephone', 'address'
], {
  refField: 'staffId'
});
