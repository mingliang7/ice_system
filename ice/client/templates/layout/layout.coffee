Template.ice_navbar.helpers
	notification: () ->
		today = moment(new Date()).format('YYYY-MM-DD')
		count = Ice.Collection.OrderGroup.find({endDate: today, closing: false}).count()
		if count > 0 
			count
		else
			0
