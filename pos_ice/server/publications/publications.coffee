Meteor.publish 'ice_customer', ->
	Ice.Collection.Customer.find() if @userId

Meteor.publish 'ice_item', ->
	Ice.Collection.Item.find() if @userId
