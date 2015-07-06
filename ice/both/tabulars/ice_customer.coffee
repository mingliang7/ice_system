# Customer
Ice.TabularTable.Customer = new (Tabular.Table)(
  name: 'iceCustomerList'
  collection: Ice.Collection.Customer
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
    {
      data: 'name'
      title: 'Name'
    }
    {
      data: 'gender'
      title: 'Gender'
    }
		{
			data: 'customerType'
			title: 'Type', render: (val) ->
        if val is 'general'
          "<p class='label label-primary'>General</p>"
        else
          "<p class='label label-warning'>#{val} days</p>"
		}
    {
      data: 'address'
      title: 'Address'
    }
    {
      data: 'telephone'
      title: 'Telephone'
    }
  ])
