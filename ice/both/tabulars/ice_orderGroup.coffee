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
Ice.TabularTable.OrderGroup = new (Tabular.Table)(
  name: 'iceOrderGroupList'
  collection: Ice.Collection.OrderGroup
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
      tmpl: Meteor.isClient and Template.ice_orderGroupAction
    }
    {
      data: '_id'
      title: 'ID'
    }
    {
      data: 'startDate'
      title: 'Start-Date'
    }
    {
      data: 'endDate'
      title: 'End-Date'
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
      data: 'paidAmount'
      title: 'Paid Amount'
      render: (val) ->
        numeral(val).format('0,0')
    }
    {
      data: 'outstandingAmount'
      title: 'Outstanding Amount'
      render: (val) ->
        numeral(val).format('0,0')
    }
    {
      data: 'total'
      title: 'Total', render: (value) ->
        format(value)
    }
  ],extraFields: ['totalInDollar', 'iceStaffId', 'groupBy', '_customer', 'iceCustomerId'])

format = (value) ->
  numeral(value).format('0,0')
