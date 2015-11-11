# Customer
IceContainer.TabularTable.Customer = new (Tabular.Table)(
  name: 'iceContainerCustomerList'
  collection: IceContainer.Collection.Customer
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
      tmpl: Meteor.isClient and Template.iceContainer_customerAction
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
  ])


String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)
