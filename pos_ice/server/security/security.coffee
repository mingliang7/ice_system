Ice.Collection.Customer.permit([
  'insert'
  'update'
  'remove'
]).ice_ifGeneral().apply()
Ice.Collection.Item.permit(['insert'])
Ice.Collection.Item.permit(['update']).ice_ifGeneral().apply
# Restuarant.Collection.FoodCategory.permit([
#   'insert'
#   'update'
#   'remove'
# ]).restuarant_ifGeneral().apply()

# Restuarant.Collection.Product.permit([
# 	'insert'
# 	'update'
# 	'remove'
# ]).restuarant_ifGeneral().apply()

# Restuarant.Collection.TempProduct.permit([
#   'insert'
#   'update'
#   'remove'
# ]).restuarant_ifGeneral().apply()

# Restuarant.Collection.Invoice.permit([
#   'insert'
#   'update'
#   'remove'
# ]).restuarant_ifGeneral().apply()
