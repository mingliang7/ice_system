findRecord = OneRecord #calling from OneRecord in query methods file
#item query
itemQuery =
  detail: (itemId, price, qty, discount = '0', amount) ->
    {name} = findRecord.item(itemId)
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
      data: 'orderDate'
      title: 'Order Date'
    }
    {
      data: '_id'
      title: 'ID'
    }
    {
      data: '_customer.name'
      title: 'Customer'
    }
    {
      data: '_customer.customerType'
      title: 'Type'
      render: (val) ->
        if val is 'general'
          "<p class='label label-primary'>General</p>"
        else
          "<p class='label label-warning'>#{val} days</p>"
    }
		{
			data: 'iceOrderDetail'
			title: 'Item', render: (val) ->
        items = []
        val.forEach (item) ->
          items.push itemQuery.detail(item.iceItemId, item.price, item.qty, item.discount, format(item.amount))
        items
    }
    {
      data: 'paidAmount'
      title: 'Paid Amount'
    }
    {
      data: 'outstandingAmount'
      title: 'Outstanding Amount'
    }
    {
      data: 'total'
      title: 'Total', render: (value) ->
        format(value)
    }
  ],extraFields: ['subtotal', 'iceStaffId', 'exchange','_staff', '_customer', 'iceOrderGroupId', 'iceCustomerId'])

format = (value) ->
  numeral(value).format('0,0')
