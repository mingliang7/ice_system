Ice.Schema.LendingReport = new SimpleSchema(
  customer:
    label: 'Customer'
    type: String
    optional: true
    autoform:
      type: 'select2'
      options: ->
        ReactiveMethod.call('getAllCustomer')
  type:
    label: 'Lending Type'
    type: String
    optional: true
    autoform:
      type: 'select2'
      options: ->
        Ice.ListForReport.lendingType()


  staffId:
    type: String
    label: 'Staff'
    optional: true
    autoform:
      type: 'select2'
      options: ->
        Ice.ListForReport.staff()

  lendingDate:
    type: String
)
