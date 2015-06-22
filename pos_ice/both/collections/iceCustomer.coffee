Ice.Collection.Customer = new Mongo.Collection('ice_customers')

Ice.Schema.Customer = new SimpleSchema(
	name:
		type: String
		max: 250

	gender: 
		type: String
		max: 10
		autoform:
			type: 'select2'
			options: ->
				Ice.List.gender()

	address:
		type: String
		max: 500

	telephone: 
		type: String
		max: 250

	type: 
		type: String
		max: 10
		autoform: 
			type: 'select2'
			options: -> 
				Ice.List.type()
)

Ice.Collection.Customer.attachSchema Ice.Schema.Customer