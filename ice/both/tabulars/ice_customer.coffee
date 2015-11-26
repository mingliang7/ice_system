# Customer
Ice.TabularTable.Customer = new (Tabular.Table)(
  name: 'iceCustomerList'
  collection: Ice.Collection.Customer
  pagingType: 'full_numbers'
  autoWidth: false
  columnDefs: [ {
    'width': '12px'
    'targets': 0
  }, {'width': '12px', 'targets': 8} ]
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
      data: 'status'
      title: 'Status', render: (val) ->
        if(val == 'enable')
          "<p class='label label-success'>#{val.capitalize()}</p>"
        else
          "<p class='label label-warning'>#{val.capitalize()}</p>"
    }
    {
      data: 'address'
      title: 'Address'
    }
    {
      data: 'telephone'
      title: 'Telephone'
    }
    {
      data: '_lendingCount'
      title: 'LC <i class="fa fa-arrow-up"></i>'
      tmpl: Meteor.isClient and Template.ice_lendingCount
    }
  ])


String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)
