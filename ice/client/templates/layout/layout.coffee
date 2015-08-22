Template.ice_navbar.helpers
	notification: () ->
		general = Counts.get('generalCount')
		group = Counts.get('groupCount')
		general + group		
	generalNotification: () ->
		Counts.get('generalCount');

	groupNotification: () ->
		# date = new Date().getDate() - 1 
		# today = moment(new Date(new Date().setDate(date))).format('YYYY-MM-DD')
		Counts.get('groupCount');
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