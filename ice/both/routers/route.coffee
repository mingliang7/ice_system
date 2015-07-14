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

Router.route 'ice/paymentGroupMonitors',
	->
		@render 'ice_paymentGroupMonitor'

	name: 'ice.paymentGroupMonitor'
	header:
		title: 'paymentGroupMonitor'
		sub: ''
	icon: 'payment'
	title: 'payment'

Router.route 'ice/paymentGeneralMonitors',
	->
		@render 'ice_paymentGeneralMonitor'

	name: 'ice.paymentGeneralMonitor'
	header:
		title: 'paymentGeneralMonitor'
		sub: ''
	icon: 'payment'
	title: 'payment'


Router.route 'ice/payments',
	->
		q = @params.query
		@render 'ice_payment',
			data: () ->
				q

	name: 'ice.payment'
	header:
		title: 'payment'
		sub: ''
	icon: 'payment'
	title: 'payment'

Router.route 'ice/payment_url',
	->
		q = @params.query
		@render 'ice_payment_url',
			data: () ->
				q

	name: 'ice.payment_url'
	header:
		title: 'payment'
		sub: ''
	icon: 'payment'
	title: 'payment'