Ice.Collection.Lending = new Mongo.Collection('ice_lending')

Ice.Schema.Lending = new SimpleSchema({
  lendingDate:
    type: Date

  customerId:
    type: String

  staffId:
    type: String

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.containerId':
    type: String

  'containers.$.condition':
    type: String

  'containers.$.returnDate':
    type: Date
    optional: true

  'containers.$.returnCondition':
    type: String
    optional: true

  'containers.$.returnMoney':
    type: Number
    decimal: true
    optional: true

})

Ice.Collection.Lending.attachSchema Ice.Schema.Lending
