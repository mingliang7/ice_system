AutoForm.hooks
	ice_orderInsertTemplate:
		before: 
			insert: (doc) ->
				doc.createdAt = new Date()
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Order, prefix, 12);
				doc.cpanel_branchId = Session.get('currentBranch')
				doc

		onSuccess: (formType, result) ->
			alertify.success 'Successfully'

		onError: (formType, error) ->
			alertify.error error.message