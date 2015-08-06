EasySearch.createSearchIndex('ice_orders', {
  collection: Ice.Collection.Order,
  field: ['_id', 'iceCustomerId','_customer.name', '_staff.name'],
  use: 'mongo-db',
  limit: 10,
  convertNumbers: true,
  props: {
    'filteredPayment': 'all'
  },
  query: function (searchString) {
    // Default query that will be used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
    // filter for categories if set
    if (this.props.filteredPayment !== 'all') {
      query.closing = eval(this.props.filteredPayment);
    }

    return query;
  }
});

EasySearch.createSearchIndex('ice_orderGroups', {
  collection: Ice.Collection.OrderGroup,
  field: ['_id', 'iceCustomerId', '_customer.name'],
  use: 'mongo-db',
  limit: 10,
  convertNumbers: true,
  props: {
    'filteredGroupPayment': 'all'
  },
  query: function (searchString) {
    // Default query that will be used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
    // filter for categories if set
    if (this.props.filteredGroupPayment !== 'all') {
      query.closing = eval(this.props.filteredGroupPayment);
    }

    return query;
  }
});