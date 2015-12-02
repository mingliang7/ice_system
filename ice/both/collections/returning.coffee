Ice.Collection.Returning = new Mongo.Collection('ice_returning')
Ice.Schema.Returning = new SimpleSchema({
  returningDate:
    type: String

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

  'containers.$.lendingId':
    type: String
    autoform:
      type: 'select'
  'containers.$.containerId':
    type: String
    autoform:
      type: 'select'
  'containers.$.condition':
    type: String
    autoform:
      type: 'select'
      options: ->
        Ice.List.condition()

  'containers.$.returnMoney':
    type: Number
    decimal: true
    optional: true
  branchId:
    type: String
    optional: true

})

Ice.Collection.Returning.attachSchema(Ice.Schema.Returning)
