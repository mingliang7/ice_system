Ice.Collection.OrderGroup = new Mongo.Collection('ice_orderGroups')
Ice.Schema.OrderGroup = new SimpleSchema(
	groupId: 
		type: String
		
	startDate:
		type: String

	endDate:
		type: String

	total:
		type: Number
		decimal: true

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
