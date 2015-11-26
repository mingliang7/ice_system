## ice container schema
```js
Ice.Schema.Container = new SimpleSchema({
  unit:
    type: Number

  price:
    type: Number
    decimal: true

  term:
    type: Number
    optional: true

  condition:
    type: String

  status:
    type: String
    autoValue: ->
      if @isInsert
        'Available'

  transaction:
    type: Array
    blackbox: true
    optional: true
    #{id, date, type: 'lending or returning',
    condtion}

})
```
## ice lending schema
```js
Ice.Schema.lending = new SimpleSchema({
  lendingDate:
    type: Date

  customerId:
    type: String

  staffId:
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

  'containers.$.returnMoney':
    type: Number
    decimal: true
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

  staffId:
    type: String

  containers:
    type: Array

  'containers.$':
    type: Object

  'containers.$.lendingId':
    type: String

  'containers.$.containerId':
    type: String

  'containers.$.condition':
    type: String

  'containers.$.returnMoney':
    type: Number
    decimal: true
    optional: true

})
```
