Template.ice_staff.onRendered ->
	createNewAlertify('staff')
Template.ice_staff.events
	'click .show': ->
		alertify.staff(renderTemplate(Template.ice_staffShowTemplate, this))
            .set({
                title: "<i class='fa fa-pencil'></i>Staff Info"
            })
	'click .remove': ->
		id = this._id
		alertify.confirm(
      fa('remove', 'Remove staff'),
      "Are you sure to delete "+id+" ?",
      ->
        Ice.Collection.Staffs.remove id, (error) ->
          if error is 'undefined' 
            alertify.error error.message 
          else
            alertify.warning 'Successfully Remove'
      null
    )
	'click .update': ->
		data = Ice.Collection.Staffs.findOne(@_id)
		alertify.staff(renderTemplate(Template.ice_staffUpdateTemplate, data))
            .set({
                title: "<i class='fa fa-pencil'></i> Edit Staff"
            })
            .maximize()
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

	ice_staffUpdateTemplate:
		onSuccess: (formType, result) ->
			alertify.success 'sucessfully'
			alertify.staff().close()
		onError: (formType, error) ->
			alertifyy.error error.message