Ice.Collection.Returning = new Mongo.Collection('ice_returning')
Ice.Schema.Returning = new SimpleSchema({
  returningDate:
    type: Date

  customerId:
    type: String

  staffId:
    type: String

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.lendingId':
    type: String

  'containers.$.containerId':
    type: String

  'containers.$.condition':
    type: String

  'containers.$.returnMoney':
    type: Number
    decimal: true
    optional: true

})

Ice.Collection.Returning.attachSchema(Ice.Schema.Returning)
