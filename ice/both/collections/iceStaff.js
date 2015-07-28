Ice.Collection.Staffs = new Mongo.Collection('ice_staffs');
Ice.Collection.Staffs.initEasySearch('name');
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
    type: String,
    autoform:{
      type: 'select2',
      options: function(){
        return Ice.List.position();
      }
    }
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
  branchId: {
    type: String,
    optional: true
  }
});

Ice.Collection.Staffs.attachSchema(Ice.Schema.Staffs);
