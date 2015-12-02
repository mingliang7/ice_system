Router.route 'ice/lending/edit/:id',
	->
		q = @params.query
		@render 'ice_lendingUpdate'
	name: 'ice.lendingUpdate'
	data: ->
		Meteor.call 'getLending', @params.id, (err, result) ->
			if(err)
				console.log(err)
			else
				Session.set('lendingUpdateObj', result)
		Session.get('lendingUpdateObj')
	header:
		title: 'payment'
		sub: ''
	icon: 'payment'
	title: 'payment'
