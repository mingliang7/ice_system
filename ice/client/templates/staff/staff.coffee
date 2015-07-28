Template.ice_staff.onRendered ->
	createNewAlertify('staff')
Template.ice_staff.events
	'click .insert': ->
		alertify.staff(renderTemplate(Template.ice_staffInsertTemplate))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Staff"
            })
            .maximize()

AutoForm.hooks
	ice_staffInsertTemplate:
		before:
			insert: (doc) ->
				prefix = "" + (Session.get('currentBranch')) + "-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Staffs, prefix, 4)
				doc.branchId = Session.get('currentBranch')
				doc

		onSuccess: (formType, result) ->
			alertify.success 'successfully'
		onError: (formType, error) ->
			alertify.error error.message