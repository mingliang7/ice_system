// Collection
Sample.Collection.Order.cacheDoc('customer', Sample.Collection.Customer, ['name', 'gender', '_address'],
    {
        referenceField: 'customerId'
        //cacheField: 'cachedField'
    });
