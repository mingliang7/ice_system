@Ice.List =
	gender: (selectOne) ->
		list = []
		if !_.isEqual(selectOne, false)
      list.push({label: "(Select One)", value: ""})

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
		if !_.isEqual(selecOne, false)
			list.push {label: "(Select One)", value: "" }

		list.push {label: 'Disable', value: 'disable'}
		list.push {label: 'Enable', value: 'enable'}
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

		customers = Ice.Collection.Customer.find()
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
		exchanges = Cpanel.Collection.Exchange.find()
		exchanges.forEach (exchange) ->
			list.push {label: "#{exchange.base}: #{JSON.stringify(exchange.rates)}", value: exchange._id}
		list

