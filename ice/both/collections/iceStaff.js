Ice.Collection.Staffs = new Mongo.Collection('staffs');

Ice.Schema.Staffs = new SimpleSchema({
  name: {
    type: String
  },
  gender: {
    type: String,
    autoform: {
      type: 'select2',
      options: function() {
        return Ice.List.gender();
      }
    }
  },
  position: {
    type: String
  },
  address: {
    type: String
  },
  telephone: {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  },
  cpanel_branchId: {
    type: String,
    optional: true
  }
});

Ice.Collection.Staffs.attachSchema(Ice.Schema.Staffs);
