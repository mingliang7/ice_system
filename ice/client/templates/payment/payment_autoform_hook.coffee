orderInvoiceUpdate= (doc) ->
	oldPaidAmount = Session.get 'oldPaidAmount'
	Session.set 'oldPaidAmount', null
	if(doc.outstandingAmount == 0)
		Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$set:{closing: true, paidAmount: oldPaidAmount + doc.paidAmount, outstandingAmount: doc.outstandingAmount}})		
	else
		Ice.Collection.Order.update({_id: doc.orderId_orderGroupId}, {$set:{paidAmount: oldPaidAmount + doc.paidAmount, outstandingAmount: doc.outstandingAmount}})
	
orderGroupInvoiceUpdate = (doc) ->
	oldPaidAmount = Session.get 'oldPaidAmount'
	Session.set 'oldPaidAmount', null
	if(doc.outstandingAmount == 0)
		Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId}, {$set:{closing: true, paidAmount: oldPaidAmount + doc.paidAmount, outstandingAmount: doc.outstandingAmount}})		
	else
		Ice.Collection.OrderGroup.update({_id: doc.orderId_orderGroupId}, {$set:{paidAmount: oldPaidAmount + doc.paidAmount, outstandingAmount: doc.outstandingAmount}})
invoiceUpdate = (doc) ->
	type = Ice.ListForReportState.get('type')
	if type is 'general'
		orderInvoiceUpdate(doc)
	else
		orderGroupInvoiceUpdate(doc)	
AutoForm.hooks
	ice_paymentInsertTemplate:
		before: 
			insert: (doc) ->
				prefix = "#{Session.get('currentBranch')}-"
				doc._id = idGenerator.genWithPrefix(Ice.Collection.Payment, prefix, 12)
				doc.cpanel_branchId = Session.get('currentBranch')
				if(doc.customerId && doc.orderId_orderGroupId isnt undefined) 
					invoiceUpdate(doc)
				doc

		onSuccess: (formType, result)	->
			alertify.success 'successfully'

		onError: (formType, error) ->
			alertify.error error.message	