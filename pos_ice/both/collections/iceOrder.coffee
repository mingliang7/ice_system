Ice.Collection.Order = new Mongo.Collection('ice_orders')

Ice.Schema.Order = new SimpleSchema(

  orderDate:
    type: String
    label: 'Order Date'
  discount:
    type: Number
    decimal: true

  total:
    type: Number
    decimal: true

  status:
    type: String
    max: 50
    autoform:
      type: 'select2'
      options: ->
        Ice.List.status()

  description:
    type: String
    max: 500

  iceCustomerId:
    type: String
    max: 10
    autoform:
      type: 'select2'
      options: ->
        Ice.List.customer()

  iceStaffId:
    type: String
    max: 10

  iceOrderGroupId:
    type: String
    max: 10

  iceOrderDetail:
    type: Array

  'iceOrderDetail.$':
    type: Object

  'iceOrderDetail.$.iceItemId':
    type: String
    autoform:
      type: 'select2'
      options: ->
        Ice.List.item()

  iceOrderGroupId:
    type: Object
    optional: true

)

Ice.Collection.Order.attachSchema Ice.Schema.Order
