Meteor.publish 'ice_item', ->
	Ice.Collection.Item.find() if @userId

Meteor.publish 'ice_order', ->
	# Counts.publish this, 'generalCount', Ice.Collection.Order.find({closing: false})
	# Ice.Collection.Order.find({closing: false})

Meteor.publish 'ice_orderGroup', ->
	# Counts.publish this, 'groupCount', Ice.Collection.OrderGroup.find({closing: false})
	# Ice.Collection.OrderGroup.find({closing: false}) if @userId

Meteor.publish 'ice_payments', ->
	# Ice.Collection.Payment.find() if @userId

Meteor.publish 'ice_userStaff', -> 
	Ice.Collection.UserStaffs.find()

Meteor.publish 'ice_staff', ->
	Ice.Collection.Staffs.find() if @userId

