var indexTmpl = Template.ice_orderGroup;

indexTmpl.events({
    'click .remove': function (event) {
        var doc = this;
        swal({
            title: "Are you sure?",
            text: "ធ្វើការលុបវិក័យប័ត្រលេខ" + this._id,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('removeGroupInvoice', doc);
            swal("Deleted!", "វិក័យប័ត្របង់ប្រាក់លេខ " + doc._id + " បានលុបដោយជោគជ័យ", "success");
        });
    }
});