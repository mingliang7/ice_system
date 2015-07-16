Template.ice_staff.onRendered ->
	createNewAlertify('staff')
Template.ice_staff.events
	'click .insert': ->
		alertify.staff(renderTemplate(Template.ice_staffInsertTemplate))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Staff"
            })
            .maximize()

Template.searchBox.helpers
	names: () ->
		Ice.Collection.Staffs.find()
AutoForm.hooks
	ice_staffInsertTemplate:
		before:
			insert: (doc) ->
				prefix = "" + (Session.get('currentBranch')) + "-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Staffs, prefix, 4)
				doc.cpanel_branchId = Session.get('currentBranch')
				doc

		onSuccess: (formType, result) ->
			alertify.success 'successfully'
			alertify.staff().close()
		onError: (formType, error) ->
			alertify.error error.message