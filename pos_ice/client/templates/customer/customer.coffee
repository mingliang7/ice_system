Template.ice_customer.onRendered ->
	createNewAlertify('customer')

Template.ice_customer.events
	'click .insert': () ->
		alertify.customer(fa("plus", "Customer"), renderTemplate(Template.ice_insertTemplate))
    .maximize();

	'click .update': () ->
		customer = Ice.Collection.Customer.findOne {_id: @_id}
		alertify.customer(fa("pencil", "Customer"), renderTemplate(Template.ice_updateTemplate, customer))
    .maximize();

	'click .remove': () ->
		id = @_id
		alertify.confirm(
			fa('remove', 'Remove customer'),
			"Are you sure to delete #{@name}?",
			->
				Ice.Collection.Customer.remove id, (error) ->
					if error is 'undefined' then alertify.error error.message else alertify.warning 'Successfully Remove'
			null
		)

	'click .show': () ->
		alertify.customer(fa('eye', 'Customer detail'), renderTemplate(Template.ice_customerShowTemplate, @))

# autoForm hook
AutoForm.hooks
	insertTemplate:
		before:
			insert: (doc) ->
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Customer, prefix, 6);
				doc.cpanel_branchId = Session.get('currentBranch')
				doc

		onSuccess: (formType, result) ->
			alertify.success 'Successfully created'

		onError: (formType, error) ->
			alertify.error error.message

	updateTemplate:
		onSuccess: (formType, result) ->
			alertify.success 'Successfully Updated'
			alertify.customer().close()

		onError: (formType, error) ->
			alertify.error error.message
