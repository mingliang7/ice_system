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

Router.route 'ice/staffs',
	->
		@render 'ice_staff'

	name: 'ice.staff'
	header:
		title: 'staff'
		sub: ''
	icon: 'staff'
	title: 'staff'

Router.route 'ice/order_reports',
	->
		@render 'ice_orderReport'

	name: 'ice.orderReport'
	header:
		title: 'Order Report'
		sub: ''
	icon: 'Order'
	title: 'Order Report'

Router.route 'ice/payment_reports',
	->
		@render 'ice_paymentReport'

	name: 'ice.paymentReport'
	header:
		title: 'Payment Report'
		sub: ''
	icon: 'payment'
	title: 'Payment Report'

Router.route 'ice/customer_reports',
	->
		@render 'ice_customerReport'

	name: 'ice.customerReport'
	header:
		title: 'Customer Report'
		sub: ''
	icon: 'customer'
	title: 'Order Report by customer'

Router.route 'ice/invoice_groups',
	->
		@render 'ice_invoiceGroup'

	name: 'ice.invoiceGroup'
	header:
		title: 'Invoice Group'
		sub: ''
	icon: 'report'
	title: 'Invoice Group'