Ice.Collection.OrderGroup = new Mongo.Collection('ice_orderGroups')
Ice.Collection.OrderGroup.initEasySearch(['_id','_customer.name'])
Ice.Schema.OrderGroup = new SimpleSchema(
	startDate:
		type: String

	endDate:
		type: String

	discount:
		type: Number
		decimal: true
		
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
	closingDate:
		type: String
		defaultValue: 'none'
	groupBy:
		type: Object
		blackbox: true
		
	_payment:
		type: Object
		blackbox: true
		optional: true

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
