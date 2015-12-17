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
		type: Array
		max: 500
		optional: true
	'address.$':
		optional: true
		type: Object
	'address.$.age':
		type: String
		optional: true
	'address.$.national':
		type: String
		optional: true
	'address.$.citizenship':
		type: String
		optional: true
	'address.$.village':
		type: String
		optional: true
	'address.$.commune':
		type: String
		optional: true
	'address.$.district':
		type: String
		optional: true
	'address.$.province':
		type: String
		optional: true
	telephone:
		type: String
		max: 250
		optional: true

	description:
		type: String
		max: 250
		optional: true

	customerType:
		type: String
		max: 10
		autoform:
			type: 'select2'
			options: ->
				Ice.List.customerType()

	branchId:
		type: String
	  optional: true

	status:
		type: String
		autoform:
			type: 'select2'
			options: ->
				Ice.List.status()
)

Ice.Collection.Customer.attachSchema Ice.Schema.Customer
