Meteor.publish 'ice_customer', ->
	Ice.Collection.Customer.find() if @userId

Meteor.publish 'ice_item', ->
	Ice.Collection.Item.find() if @userId

Meteor.publish 'ice_order', ->
	Ice.Collection.Order.find() if @userId

Meteor.publish 'ice_orderGroup', ->
	Ice.Collection.OrderGroup.find() if @userId 
Meteor.publish 'ice_payments', ->
	Ice.Collection.Payment.find() if @userId
Meteor.publish 'ice_userStaff', ->
	Ice.Collection.UserStaffs.find() if @userId