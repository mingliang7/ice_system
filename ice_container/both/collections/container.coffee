IceContainer.Collection.Container = new Mongo.Collection('iceContainer_container')

IceContainer.Schema.Container = new SimpleSchema(
  code:
    type: String

  status:
    type: String


)

IceContainer.Collection.Container.attachSchema IceContainer.Schema.Container
