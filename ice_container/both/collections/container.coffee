IceContainer.Collection.Container = new Mongo.Collection('iceContainer_container')

IceContainer.Schema.Container = new SimpleSchema(
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

  return:
    type: Array
    blackbox: true
    optional: true



)

IceContainer.Collection.Container.attachSchema IceContainer.Schema.Container
