Router.route 'ice/customers',
	->
    @render 'ice_customer'

  name: 'ice.customer'
  header:
    title: 'customer'
    sub: ''
	icon: 'customer'
	title: "customer"

Router.route 'ice/orders',
	->
		@render 'ice_order'

	name: 'ice.order'
	header:
		title: 'order'
		sub: ''
	icon: 'shopping-cart'
	title: 'order'
