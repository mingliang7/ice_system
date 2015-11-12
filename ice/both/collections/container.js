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
  transaction: {
    type: Array,
    optional: true
  },
  'transaction.$': {
    type: Object,
    blackbox: true,
    optional: true
  },
  status: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return 'Available';
      }
    }
  }
});

Ice.Collection.Container.attachSchema(Ice.Schema.Container);
