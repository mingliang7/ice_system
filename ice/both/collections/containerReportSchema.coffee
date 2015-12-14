Ice.Schema.ContainerReport = new SimpleSchema(
  importDate:
    label: 'Import Date'
    type: String

  status:
    type: String
    optional: true
    autoform:
      type: 'select2'
      options: ->
        Ice.ListForReport.containerStatus()
)
