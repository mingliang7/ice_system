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

Router.route 'ice/paymentMonitors',
	->
		@render 'ice_paymentMonitor'

	name: 'ice.paymentMonitor'
	header:
		title: 'paymentMonitor'
		sub: ''
	icon: 'payment'
	title: 'payment'

Router.route 'ice/payments',
	->
		@render 'ice_payment',
			data: () ->
				@params.query


	name: 'ice.payment'
	header:
		title: 'payment'
		sub: ''
	icon: 'payment'
	title: 'payment'