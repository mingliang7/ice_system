Ice.Collection.Customer.permit([
  'insert'
  'update'
  'remove'
]).ice_ifGeneral().apply()
Ice.Collection.Item.permit(['insert'])
Ice.Collection.Item.permit(['update']).ice_ifGeneral().apply
Ice.Collection.Order.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()
Ice.Collection.OrderGroup.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()