Router.route 'ice/lending/insert/:customerId',
	->
		q = @params.query
		@render 'ice_lendingInsert'
	name: 'ice.lendingInsert'
	data: ->
    []
	header:
		title: 'New Lending'
		sub: ''
	icon: 'lending'
	title: 'New Lending'
