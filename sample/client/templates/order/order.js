var indexTpl = Template.sample_order,
    insertTpl = Template.sample_orderInsert,
    updateTpl = Template.sample_orderUpdate,
    showTpl = Template.sample_orderShow,
    customerAddonTpl = Template.sample_customerInsert;

// Index
indexTpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify(['order', 'customer']);
});

indexTpl.onRendered(function () {
    //
});

indexTpl.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.order(fa("plus", "Order"), renderTemplate(insertTpl));
    },
    'click .update': function (e, t) {
        var data = Sample.Collection.Order.findOne(this._id);
        alertify.order(fa("pencil", "Order"), renderTemplate(updateTpl, data));
    },
    'click .remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Order"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                Sample.Collection.Order.remove(self._id, function (error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null
        );

    },
    'click .show': function (e, t) {
        var data = Sample.Collection.Order.findOne({_id: this._id});

        alertify.alert(fa("eye", "Order"), renderTemplate(showTpl, data));
    }
});

indexTpl.onDestroyed(function () {
    //
});

// Insert
insertTpl.onRendered(function () {
    datePicker();
});

insertTpl.events({
    'click .customerAddon': function (e, t) {
        alertify.customer(fa("plus", "Customer"), renderTemplate(customerAddonTpl));
    }
});

// Update
updateTpl.onRendered(function () {
    datePicker();
});

updateTpl.events({
    'click .customerAddon': function (e, t) {
        alertify.customer(fa("plus", "Customer"), renderTemplate(customerAddonTpl));
    }
});

// Hook
AutoForm.hooks({
    // Order
    sample_orderInsert: {
        before: {
            insert: function (doc) {
                var prefix = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(Sample.Collection.Order, prefix, 3);
                doc.cpanel_branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    sample_orderUpdate: {
        onSuccess: function (formType, result) {
            alertify.order().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    // Customer addon
    sample_customerAddon: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(Sample.Collection.Customer, 3);
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            //alertify.customer();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

// Config date picker
var datePicker = function () {
    var dob = $('[name="orderDate"]');
    DateTimePicker.date(dob);
};
