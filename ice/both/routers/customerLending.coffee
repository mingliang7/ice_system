Router.route 'ice/customer/:customerId',
	->
		q = @params.query
		@render 'ice_lendingInsert'
	name: 'ice.cusomterLending'
	header:
		title: 'payment'
		sub: ''
	icon: 'payment'
	title: 'payment'
