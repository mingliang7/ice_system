Template.ice_navbar.helpers
	notification: () ->
		general = Ice.Collection.Order.find({closing: false}).count()
		today = moment(new Date().getDate() + 1).format('YYYY-MM-DD')
		group = Ice.Collection.OrderGroup.find({endDate: today}).count()
		general + group 
	generalNotification: () ->
		Ice.Collection.Order.find({closing: false}).count()

	groupNotification: () ->
		today = moment(new Date().getDate() + 1).format('YYYY-MM-DD')
		Ice.Collection.OrderGroup.find({endDate: today}).count()

