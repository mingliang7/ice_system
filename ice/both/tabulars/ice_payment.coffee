# Customer
Ice.TabularTable.Payment = new (Tabular.Table)(
  name: 'icePaymentList'
  collection: Ice.Collection.Payment
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
      tmpl: Meteor.isClient and Template.ice_paymentAction
    }
    {
      data: 'paymentDate'
      title: 'Payment Date'
    }
    {
      data: 'orderId_orderGroupId'
      title: 'Order ID'
    }
		{
			data: 'dueAmount'
			title: 'Due Amount', render: (value) ->
        format(value)
			
		}
    {
      data: 'paidAmount'
      title: 'Paid Amount', render: (value) ->
        format(value)
    }
    {
      data: 'outstandingAmount'
      title: 'Outstanding Amount', render: (value) ->
        format(value)
    }
    {
      data: 'status'
      title: 'Status', render: (val) ->
        if val is 'Partial'
          "<p class='label label-warning'>Partial</p>"
        else
          "<p class='label label-success'>Close</p>"
    }
  ],extraFields: ['customerId'])

format = (value) ->
  numeral(value).format('0,0')