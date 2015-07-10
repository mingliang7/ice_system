findRecord = OneRecord #calling from OneRecord in query methods file
#item query
itemQuery = 
  detail: (itemId, qty, discount = '0', amount) ->
    {name, price} = findRecord.item(itemId)
    "<small>
    {Name:#{name}, 
    Price: #{price}, 
    Qty:#{qty},
    Discount:#{discount},
    Amount: #{amount}}</small>"

#customer query
customerDetail = 
  name: (val) ->
    {name} = findRecord.customer(val)
    name
  type: (val) ->
    {customerType} = findRecord.customer(val)
    if customerType is 'general'
      "<p class='label label-primary'>General</p>"
    else
      "<p class='label label-warning'>#{customerType} days</p>"

# Order Tabular
Ice.TabularTable.Order = new (Tabular.Table)(
  name: 'iceOrderList'
  collection: Ice.Collection.Order
  pagingType: 'full_numbers'
  autoWidth: false
  columnDefs: [ {
    'width': '12px'
    'targets': 0
  } ]
  order: [ [
    '1'
    'desc'
  ] ]
  columns: [
    {
      title: '<i class="fa fa-bars"></i>'
      tmpl: Meteor.isClient and Template.ice_orderAction
    }
    {
      data: '_id'
      title: 'ID'
    }
    {
      data: 'iceCustomerId'
      title: 'Customer'
      render: (val) ->
        customerDetail.name(val)
    }
    {
      data: 'iceCustomerId'
      title: 'Type'
      render: (val) ->
        customerDetail.type(val)
    }
		{
			data: 'iceOrderDetail'
			title: 'Item', render: (val) ->
        items = []
        val.forEach (item) ->
          items.push itemQuery.detail(item.iceItemId, item.qty, item.discount, format(item.amount))
        items
    }
    {
      data: 'discount'
      title: 'Discount'
      render: (val) ->
        if val isnt undefined
          "<p class='label label-success'>#{val}%</p>" 
        else
          "<p class='label label-success'>None</p>" 
    }
    {
      data: 'total'
      title: 'Total', render: (value) ->
        format(value) 
    }
  ])

format = (value) ->
  numeral(value).format('0,0')
