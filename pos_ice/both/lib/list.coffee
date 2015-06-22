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
