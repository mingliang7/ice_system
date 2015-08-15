Template.ice_navbar.helpers
	notification: () ->
		general = Ice.Collection.Order.find({closing: false}).count()
		# date = new Date().getDate() - 1 
		# today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD')
		group = Ice.Collection.OrderGroup.find({closing: false}).count()
		general + group 
	generalNotification: () ->
		Ice.Collection.Order.find({closing: false}).count()

	groupNotification: () ->
		# date = new Date().getDate() - 1 
		# today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD')
		Ice.Collection.OrderGroup.find({closing: false}).count()

	isAdmin: () ->
		admin = false
		userId = Meteor.userId()
		user = Meteor.users.findOne(userId)
		i = 0 
		while i < user.roles.Ice.length
			if user.roles.Ice[i] == 'admin'
				admin = true
			i++
		admin