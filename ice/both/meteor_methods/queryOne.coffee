@OneRecord =
  customer: (customerId) ->
    Ice.Collection.Customer.findOne customerId

  item: (itemId) ->
    Ice.Collection.Item.findOne itemId

  findOrderGroupActiveDate: (customerId, startDate, endDate) ->
  	Ice.Collection.OrderGroup.findOne({iceCustomerId: customerId, closing: false, startDate: startDate, endDate: endDate})
