# Restuarant.TabularTable.FoodCategory = new (Tabular.Table)(
#   name: 'restuarantFoodCategoryList'
#   collection: Restuarant.Collection.FoodCategory
#   columns: [
#     {
#       data: '_id'
#       title: 'ID'
#     }
#     {
#       data: 'name'
#       title: 'Name'
#     }
#     {
#       title: '<i class="fa fa-bars"></i>'
#       tmpl: Meteor.isClient and Template.restuarant_categoryAction
#     }
#   ]
#   order: [ [
#     '0'
#     'desc'
#   ] ]
#   columnDefs: [ {
#     'width': '12px'
#     'targets': 2
#   } ])
Ice.TabularTable.Customer = new (Tabular.Table)(
	name: 'iceCustomer'
	collection: Ice.Collection.Customer
	columns: [
		{
			data: '_id'
			title: 'ID'
		}
		
		{
			data: 'name'
			title: 'Name'
		}
		
		{
			data: 'gender'
			title: 'Gender'
		}
		
		{
			data: 'address'
			title: 'Address'
		}
		
		{
			data: 'telephone'
			title: 'Telephone'
		}
		
		{
			data: 'type'
			title: 'Type'
		}

		{
			title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient and Template.ice_customer
		}
	]
	order: [[
		'0'
		'desc'
	]]
	columnDefs: [
		'width': '12px'
		'targets': 6
	]
)