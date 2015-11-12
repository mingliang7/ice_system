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

  option:
    type: String
    optional: true

  status:
    type: String
    autoValue: ->
      if @isInsert
        'Available'

})
```
