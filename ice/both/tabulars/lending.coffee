# Customer
Ice.TabularTable.Lending = new (Tabular.Table)(
  name: 'iceLendingList'
  collection: Ice.Collection.Lending
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
      tmpl: Meteor.isClient and Template.ice_lendingAction
    }
    {
      data: '_id'
      title: 'ID'
    }
    {
      data: 'code'
      title: 'Code'
    }
    {
      data: 'unit'
      title: 'Unit'
    }
    {
      data: 'price'
      title: 'Price'
    }
    {
      data: 'condition'
      title: 'Condition'
    }
    {
      data: 'status'
      title: 'Status', render: (val) ->
        if val is 'Available'
          "<label class='label label-success'>#{val}</label>"
        else if val is 'Unavailable'
          "<label class='label label-info'>#{val}</label>"
        else
          "<label class='label label-warning'>#{val}</label>"
    }
    {
      data: 'option'
      title: 'Option'
    }
  ])


String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)
