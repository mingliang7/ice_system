IceContainer.Collection.Customer = new Mongo.Collection('iceContainer_customers')

IceContainer.Schema.Customer = new SimpleSchema(
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
		optional: true

	telephone:
		type: String
		max: 250
		optional: true

	description:
		type: String
		max: 250
		optional: true

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

IceContainer.Collection.Customer.attachSchema IceContainer.Schema.Customer
