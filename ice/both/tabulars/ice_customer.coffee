# Customer
Ice.TabularTable.Customer = new (Tabular.Table)(
  name: 'iceCustomerList'
  collection: Ice.Collection.Customer
  pagingType: 'full_numbers'
  autoWidth: false
  columnDefs: [ {
    'width': '12px'
    'targets': 0
  }, {'width': '12px', 'targets': 8},{'width': '12px', 'targets': 9} ]
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
      data: 'age'
      title: 'Address Info', render: (value, type, doc) ->
        if doc.village isnt undefined
          "#{doc.village}, #{doc.commune}, #{doc.province}..."
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
    {
      data: '_returningCount'
      title: 'RC <i class="fa fa-arrow-down"></i>'
      tmpl: Meteor.isClient and Template.ice_returningCount
    }
  ], extraFields: ['age', 'national', 'citizenship', 'village', 'commune', 'district', 'province'])


String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)
