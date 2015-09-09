Meteor.startup ->
  Data = {}
  Data.item0001 = {code: '0001', name: 'ទឹកកកកិន (kg)', price: 250, status:'enable',unit:'kg'}
  Data.item0002 = {code: '0002', name: 'ទឹកកកម៉ត់ (kg)', price: 250, status:'enable',unit:'kg'}
  Data.item0003 = {code: '0003', name: 'ទឹកកកអនាម័យ-តូច (kg)', price: 250, status:'enable',unit:'kg'}
  Data.item0004 = {code: '0004', name: 'ទឹកកកអនាម័យ-ធំ (kg)', price: 250, status:'enable',unit:'kg'}
  Data.item0005 = {code: '0005', name: 'ទឹកកកដើម (ដើម)' , price:18000, status:'enable',unit:'kg'}
  itemAmount = Ice.Collection.Item.find().count()
  if itemAmount < 5
    i = itemAmount
    while i < 5
      Ice.Collection.Item.insert Data["item000#{i+ 1}"]
      i++

  # Meteor.call 'findOrderWhichHasNoGroupId'
  # Meteor.call 'findOrderWhichIsNameDifferenctFromGroup'
  # Meteor.call 'correctOrderCustomer', '2015-08-10 00:00:00'
