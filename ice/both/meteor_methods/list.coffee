Meteor.methods
	customer: () ->
		list = []
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
	invoice: (flag, id) ->
		list = []
		customerType = ''
		update = flag
		customerId = id
		if customerId != ''
		  type = Ice.Collection.Customer.findOne(customerId).customerType
		  if update == true
		    if type == 'general'
		      Ice.Collection.Order.find(iceCustomerId: customerId).forEach (invoice) ->
		        list.push
		          label: '' + invoice._id + ' | ' + invoice.orderDate
		          value: invoice._id
		   
		      Ice.ListForReportState.set 'type', type
		    else
		      Ice.Collection.OrderGroup.find(iceCustomerId: customerId).forEach (invoice) ->
		        list.push
		          label: '' + invoice._id + ' | ' + invoice.startDate + ' To ' + invoice.endDate
		          value: invoice._id
		      Ice.ListForReportState.set 'type', type
		  else
		    if type == 'general'
		      Ice.Collection.Order.find(
		        iceCustomerId: customerId
		        closing: false).fetch().forEach (invoice) ->
		        list.push
		          label: '' + invoice._id + ' | ' + invoice.orderDate
		          value: invoice._id
		    else
		      Ice.Collection.OrderGroup.find(
		        iceCustomerId: customerId
		        closing: false).fetch().forEach (invoice) ->
		        list.push
		          label: '' + invoice._id + ' | ' + invoice.startDate + ' To ' + invoice.endDate
		          value: invoice._id
		        return
		  customerType = type

		console.log(list)
		{list: list, type: customerType}