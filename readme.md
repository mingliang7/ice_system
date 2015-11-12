## ice container schema
```js
Ice.Schema.Container = new SimpleSchema({
  condition:
    type: String

  unit:
    type: String

  price:
    type: Number
    decimal: true

  term:
    type: Number
    optional: true

  status:
    type: String
    autoValue: ->
      if @isInsert
        'Available'

  transaction:
    type: Array
    blackbox: true
    optional: true

})
```
## ice lending schema
```js
Ice.Schema.lending = new SimpleSchema({
  lendingDate:
    type: Date

  customerId:
    type: String

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.containerId':
    type: String
  
  'containers.$.condition':
    type: String

  'containers.$.returnDate':
    type: Date
    optional: true

  'containers.$.returnCondition':
    type: String
    optional: true

})
```
## ice returning schema
```js
Ice.Schema.returning = new SimpleSchema({
  returningDate:
    type: Date

  customerId:
    type: String

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.containerId':
    type: String

})
```
