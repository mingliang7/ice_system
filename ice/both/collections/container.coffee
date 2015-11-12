Ice.Collection.Container = new Mongo.Collection('ice_container')

Ice.Schema.Container = new SimpleSchema(
  code:
    type: String

  condition:
    type: String

  unit:
    type: String

  price:
    type: Number
    decimal: true

  option:
    type: String
    optional: true

  status:
    type: String
    autoValue: ->
      if @isInsert
        'Available'

)

Ice.Collection.Container.attachSchema Ice.Schema.Container
