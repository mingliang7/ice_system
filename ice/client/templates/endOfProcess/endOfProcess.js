Template.ice_endOfProcess.onRendered(function(){
	createNewAlertify('endOfProcess');
});
Template.ice_endOfProcessInsertTemplate.onRendered(function(){
	datePicker();
});
Template.ice_endOfProcess.events({
	'click .insert': function(){
		alertify.endOfProcess(fa("plus", "End Of Process"), renderTemplate(Template.ice_endOfProcessInsertTemplate));
	}
});

var datePicker = function(){
	var date = $('[name="date"]');
	DateTimePicker.date(date);
}


//autoform hook 

AutoForm.hooks({
	ice_endOfProcessInsertTemplate: {
		onSuccess: function(formType ,result){
			alertify.endOfProcess().close();
			alertify.success('Successfully');
		},
		onError: function(formType, error){
			alertify.error(error.message);
		}
	}
})