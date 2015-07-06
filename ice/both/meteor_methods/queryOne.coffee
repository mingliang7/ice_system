@OneRecord = 
  customer: (customerId) ->
    Ice.Collection.Customer.findOne customerId

  item: (itemId) ->
    Ice.Collection.Item.findOne itemId

  findOrderGroupActiveDate: (customerId, startDate, endDate) ->
  	startDay = moment(startDate).format('DD')
  	endDay = moment(endDate).format('DD')
  	month = moment(endDate).format('MM')
  	if endDay is '30' && startDay is '30' 
  		Ice.Collection.OrderGroup.findOne({iceCustomerId: customerId, startDate:{$lte: endDate}, endDate: {$gte: startDate}})
  	else if month is '02'
  		if startDay is '29' && endDay is '29' or startDay is '28' && endDay is '28' 
  			Ice.Collection.OrderGroup.findOne({iceCustomerId: customerId, startDate:{$lte: endDate}, endDate: {$gt: startDate}})
  	else
  		Ice.Collection.OrderGroup.findOne({iceCustomerId: customerId, startDate:{$lt: endDate}, endDate: {$gt: startDate}})
