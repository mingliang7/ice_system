# Customer
Ice.TabularTable.ContainerList = new (Tabular.Table)(
  name: 'iceContainerList'
  collection: Ice.Collection.Container
  pagingType: 'full_numbers'
  autoWidth: false
  columnDefs: [ {

  } ]
  order: [ [
    '1'
    'desc'
  ] ]
  columns: [
    {
      data: '_id'
      title: 'ID'
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
