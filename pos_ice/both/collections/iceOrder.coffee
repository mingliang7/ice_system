Ice.Collection.Order = new Mongo.Collection('ice_orders')

Ice.Schema.Order = new SimpleSchema(

  orderDate:
    type: String
    label: 'Order Date'

  discount:
    type: Number
    decimal: true
    optional: true

  subtotal:
    type: Number
    decimal: true

  total:
    type: Number
    decimal: true

  status:
    type: String
    max: 50
    optional: true
    autoform:
      type: 'select2'
      options: ->
        Ice.List.status()

  description:
    type: String
    max: 500
    optional: true

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
    optional: true
  iceOrderGroupId:
    type: String
    max: 10

  iceOrderDetail:
    type: Array
    minCount: 1

  'iceOrderDetail.$':
    type: Object

  'iceOrderDetail.$.iceItemId':
    type: String
    autoform:
      type: 'selectize'
      options: ->
        Ice.List.item()
        
  'iceOrderDetail.$.price':
    type: Number
    decimal: true

  'iceOrderDetail.$.qty':
    type: Number

  'iceOrderDetail.$.amount':
    type: Number
    decimal: true

  'iceOrderDetail.$.discount':
    type: Number
    decimal: true
    optional: true

  iceOrderGroupId:
    type: Object
    optional: true
    blackbox: true
)

Ice.Collection.Order.attachSchema Ice.Schema.Order
