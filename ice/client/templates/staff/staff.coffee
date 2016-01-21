Template.ice_staff.onRendered ->
	createNewAlertify('staff')
Template.ice_staff.events
	'click .show': ->
		alertify.staff(fa('eye', 'Staff Show'),renderTemplate(Template.ice_staffShowTemplate, this).html)
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
			alertify.staff(fa('pencil','Update Staff'),renderTemplate(Template.ice_staffUpdateTemplate, data))
            .maximize()
		else
	  	alertify.error "Staff ##{id} is in user map :("
	'click .insert': ->
		alertify.staff(fa('plus', 'Add Staff'),renderTemplate(Template.ice_staffInsertTemplate))
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
DateTimePicker
