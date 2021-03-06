@Ice.List =
	lendingType: ->
		[{label: '(Select One)', value: ''},{label: 'Short Term', value: 'shortTerm'},{label: 'Long Term', value: 'longTerm'}]
	containerCondition: ->
		[
						{label: '(Select One)', value: ''}
						{label: 'Good', value: 'good'},
						{label: 'Medium', value: 'medium'},
						{label: 'Bad', value: 'bad'},
						{label: 'Broken', value: 'broken'}
					 ]
	condition: ()->
		list = [
						{label: 'Good', value: 'good'},
						{label: 'Medium', value: 'medium'},
						{label: 'Bad', value: 'bad'},
						{label: 'Broken', value: 'broken'}
					 ]
	gender: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
			list.push {label: "(Select One)", value: ""}

		list.push {label: 'Male', value: 'M'}
		list.push {label: 'Female', value: 'F'}
		list

	customerType: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
			list.push {label: "(Select One)", value: ""}

		list.push {label: 'General', value: 'general'}
		list.push {label: '5 days', value: '5'}
		list.push {label: '10 days', value: '10'}
		list.push {label : '15 days', value: '15'}
		list.push {label: '20 days', value: '20'}
		list.push {label: '30 days', value: '30'}
		list

	status: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
			list.push {label: "(Select One)", value: "" }

		list.push {label: 'Disable', value: 'disable'}
		list.push {label: 'Enable', value: 'enable'}
		list
	position: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
			list.push {label: "(Select One)", value: "" }

		list.push {label: 'Seller', value: 'seller'}
		list.push {label: 'Cashier', value: 'cashier'}
		list.push {label: 'Accountant', value: 'accountant'}
		list.push {label: 'Admin', value: 'admin'}
		list.push {label: 'Manager', value: 'manager'}
		list

	unit: (selectOne) ->
		list = []
		if !_.isEqual(selecOne, false)
			list.push {label: "(Select One)", value: "" }

		list.push {label: 'Derm', value: 'D'}
		list.push {label: 'Kg', value: 'kg'}

	customer: (selecOne) ->
		list = []
		if !_.isEqual(selecOne, false)
			list.push {label: '(Select One)', value: ""}

		customers = Ice.Collection.Customer.find({status: 'enable'})
		customers.forEach (customer) ->
			type = ''
			if customer.customerType is 'general'
				type = '(general)'
			else
				type = "(#{customer.customerType} days)"
			list.push {label: "#{customer._id} | #{customer.name} #{type}", value: customer._id}
		list
	staff: (selecOne) ->
		list = []
		userId = Meteor.userId()
		staff = Ice.Collection.UserStaffs.findOne({userId: userId})
		list.push {label: "(Select One)", value: "" }
		if staff != undefined
			findStaff(list, staff.staffIds)
		list

	paymentStaff: (selecOne) ->
		list = []
		staffs = Ice.Collection.Staffs.find()
		if !_.isEqual(selecOne, false)
			list.push {label: "(Select One)", value: "" }
		staffs.forEach (staff) ->
			list.push {label: "#{staff._id} | #{staff.name}", value: staff._id}
		list
	item: (selectOne) ->
		list = []
		items = Ice.Collection.Item.find()
		items.forEach (item) ->
			list.push {label: "#{item.code} | #{item.name}", value: item._id}

		list

	exchange: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
			list.push {label: '(Select One)', value: ''}
		exchanges = Cpanel.Collection.Exchange.find({}, {sort: {dateTime: -1}});
		exchanges.forEach (exchange) ->
			list.push {label: "#{exchange.base}: #{JSON.stringify(exchange.rates)}", value: exchange._id}
		list
	getStaffListByBranchId:(selectOne)->
    list = []
    if !_.isEqual(selectOne, false)
      list.push {label: '(Select One)', value: ''}
    branchId = Session.get('currentBranch');
    staffs = Ice.Collection.Staffs.find({branchId:branchId})
    staffs.forEach (staff) ->
      list.push {label: staff._id + ' : ' + staff.name, value: staff._id}
    list
  branchForUser:(selectOne, userId) ->
	  list = []
	  if !_.isEqual(selectOne, false)
	    list.push
	      label: 'All'
	      value: ''
	  userId = if _.isUndefined(userId) then Meteor.userId() else userId
	  Meteor.users.findOne(userId).rolesBranch.forEach (branch) ->
	    label = Cpanel.Collection.Branch.findOne(branch).enName
	    list.push
	      label: label
	      value: branch
	    return
	  list
  backupAndRestoreTypes: ->
	  [
	    {
	      value: ''
	      label: 'Select One'
	    }
	    {
	      value: 'Setting'
	      label: 'Setting'
	    }
	    {
	      value: 'Default'
	      label: 'Default'
	    }
	    {
	      value: 'Setting,Default'
	      label: 'Setting And Default'
	    }
	  ]


# functions
staffName = (id) ->
	{name} = Ice.Collection.Staffs.findOne(id)
	name
findStaff = (list, staffIds) ->
	i = 0
	while i < staffIds.length
		list.push {label: staffName(staffIds[i]), value: staffIds[i]}
		i++
	list
