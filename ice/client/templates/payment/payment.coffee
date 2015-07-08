Template.ice_payment.events
	'change [name="customerId"]': (e) ->
		customer = $(e.currentTarget).val()
		if customer isnt ''
			$('[name="invoiceId"]').attr('disabled', false) 
		else
			$('[name="invoiceId"]').attr('disabled', true)

