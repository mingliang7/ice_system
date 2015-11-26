Ice.Collection.Container = new Mongo.Collection('ice_container');

Ice.Schema.Container = new SimpleSchema({
  unit: {
    type: Number
  },
  price: {
    type: Number,
    decimal: true
  },
  term: {
    type: Number,
    optional: true
  },
  condition: {
    type: String
  },
  status: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return 'Available';
      }
    }
  },
  // transaction = [{id, date, type: 'lending or returning', condition}]
  transaction: {
    type: Array,
    optional: true
  },
  'transaction.$': {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Ice.Collection.Container.attachSchema(Ice.Schema.Container);
