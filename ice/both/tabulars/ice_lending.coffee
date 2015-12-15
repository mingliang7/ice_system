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
      data: '_customer.name'
      title: 'Customer'
    }
    {
      data: '_staff.name'
      title: 'Staff'
    }
    {
      data: 'lendingDate'
      title: 'Lending Date'
    }
    {
      data: 'lendingType'
      title: 'Lending Type'
    }
    {
      data: 'containers'
      title: 'Container', render: (containers) ->
        concate = ''
        containers.forEach (container) ->
          concate += "<li>ID: #{container.containerId}, Status: #{container.condition.capitalize()}</li>"

        concate
    }
  ], extraFields: ['customerId', 'staffId'])


String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)
