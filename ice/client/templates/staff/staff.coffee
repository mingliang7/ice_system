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
		available = checkAvailable(id);
		if available	
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
		else
			alertify.error "Staff ##{id} is in user map :("
	'click .update': ->
		data = Ice.Collection.Staffs.findOne(@_id)
		id = @_id
		available = checkAvailable(id)
		if available
			alertify.staff(renderTemplate(Template.ice_staffUpdateTemplate, data))
            .set({
                title: "<i class='fa fa-pencil'></i> Edit Staff"
            })
            .maximize()
		else
	  	alertify.error "Staff ##{id} is in user map :("
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

# funcions

checkAvailable = (id) ->
	flag = false
	userId = Meteor.userId()
	currentUser = Ice.Collection.UserStaffs.findOne({userId: userId})
	if currentUser.staffIds
		i = 0 
		while i < currentUser.staffIds.length
			if id == currentUser.staffIds[i]
				flag
			else
				flag = true
			i++
		flag