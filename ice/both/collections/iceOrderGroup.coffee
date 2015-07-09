Ice.Collection.OrderGroup = new Mongo.Collection('ice_orderGroups')
Ice.Schema.OrderGroup = new SimpleSchema(
	startDate:
		type: String

	endDate:
		type: String

	total:
		type: Number
		decimal: true
	
	totalInDollar:
		type: Number
		decimal: true

	outstandingAmount:
		type: Number
		decimal: true
		optional: true
	
	paidAmount:
		type: Number
		decimal: true
		optional: true
	
	closing: 
		type: Boolean
		defaultValue: false

	groupBy:
		type: Object
		blackbox: true

	iceCustomerId:
		type: String

	createdAt: 
		type: Date
		optional: true
	updatedAt:
		type: Date
		optional: true
)

Ice.Collection.OrderGroup.attachSchema Ice.Schema.OrderGroup
