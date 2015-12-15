Ice.Collection.Lending = new Mongo.Collection('ice_lending')

Ice.Schema.Lending = new SimpleSchema({
  lendingDate:
    type: String

  lendingType:
    type: String
    autoform:
      type: 'select2'
      options: ->
        Ice.List.lendingType()

  customerId:
    type: String

  staffId:
    type: String
    autoform:
      type: 'select2'
      options: ->
        Ice.List.staff()

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.containerId':
    type: String

  'containers.$.condition':
    type: String
    autoform:
      type: 'select'
      options: ->
        Ice.List.condition()

# update when return container
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

  branchId:
    type: String
    optional: true

})

Ice.Collection.Lending.attachSchema Ice.Schema.Lending
