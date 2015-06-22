Meteor.publish 'ice_customer', ->
	Ice.Collection.Customer.find() if @userId