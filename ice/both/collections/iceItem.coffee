Ice.Collection.Item = new Mongo.Collection('ice_items')

Ice.Schema.Item = new SimpleSchema(
	price:
    type: Number
    decimal: true

  status:
    type: String
    max: 50
    autoform:
      type: 'select2'
      options: ->
      	Ice.List.status()

  unit:
    type: String
    max: 50
    autoform:
      type: 'select2'
      options: ->
        Ice.List.unit()

	name:
		type: String
		max: 250

	code:
		type: String
		max: 10
)

Ice.Collection.Item.attachSchema Ice.Schema.Item
