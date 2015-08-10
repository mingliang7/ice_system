Template.ice_home.onRendered(function(){
	createNewAlertify('order');
});
Template.ice_home.events({
	'change [name="customer"]': function(e){
		var id = $(e.currentTarget).val()
		if(id != ''){
			alertify.order(fa('eye', 'Order'), renderTemplate(Template.ice_orderInsertTemplate))
			.maximize()
		}
	}

});