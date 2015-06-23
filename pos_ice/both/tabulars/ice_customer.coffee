# Order
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
      tmpl: Meteor.isClient and Template.ice_customerAction
    }
    {
      data: '_id'
      title: 'ID'
    }
    # {
    #   data: 'name'
    #   title: 'Name'
    # }
    # {
    #   data: 'gender'
    #   title: 'Gender'
    # }
		# {
		# 	data: 'customerType'
		# 	title: 'Type', render: (val) ->
    #     "#{val} days"
		# }
    # {
    #   data: 'address'
    #   title: 'Address'
    # }
    # {
    #   data: 'telephone'
    #   title: 'Telephone'
    # }
  ])
