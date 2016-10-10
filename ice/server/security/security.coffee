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
Ice.Collection.OrderGroup.permit([
		'insert'
  	'update'
  	'remove'
]).ice_ifAdmin().apply()

Ice.Collection.Payment.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()

Ice.Collection.UserStaffs.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()

Ice.Collection.Staffs.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()

Ice.Collection.RemoveInvoiceLog.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()

Ice.Collection.EndOfProcess.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()

Ice.Collection.Container.permit([
  'insert'
  'update'
  'remove'
]).ice_ifGeneral().apply()

Ice.Collection.Lending.permit([
  'insert'
  'update'
  'remove'
]).ice_ifGeneral().apply()

Ice.Collection.Returning.permit([
  'insert'
  'update'
  'remove'
]).ice_ifGeneral().apply()
Ice.Collection.GroupInvoice.permit([
    'insert'
    'update'
    'remove'
]).ice_ifGeneral().apply()
Ice.Collection.ReceivePayment.permit([
	'insert'
	'update'
	'remove'
]).ice_ifGeneral().apply()
