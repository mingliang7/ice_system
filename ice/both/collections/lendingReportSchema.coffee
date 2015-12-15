Ice.Schema.LendingReport = new SimpleSchema(
  customer:
    label: 'Customer'
    type: String
    optional: true
    autoform:
      type: 'select2'
      options: ->
        ReactiveMethod.call('getAllCustomer')

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
