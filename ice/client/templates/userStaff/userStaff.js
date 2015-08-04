/**
 * Create new custom  alertify
 */
Template.ice_userStaff.onRendered(function () {
    createNewAlertify("userStaff");
});

/**
 * Index
 */
Template.ice_userStaff.events({
    'click .insert': function (e, t) {

        alertify.userStaff(renderTemplate(Template.ice_userStaffInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Add New UserStaff"
            })

    },
    'click .update': function (e, t) {

        var data = Ice.Collection.UserStaffs.findOne(this._id);

        alertify.userStaff(renderTemplate(Template.ice_userStaffUpdate, data))
            .set({
                title: '<i class="fa fa-pencil"></i> Update Existing UserStaff'
            })

    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    Ice.Collection.UserStaffs.remove(id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                title: '<i class="fa fa-remove"></i> Delete UserStaff'
            });

    },
    'click .show': function (e, t) {

        alertify.alert(renderTemplate(Template.ice_userStaffShow, this))
            .set({
                title: '<i class="fa fa-eye"></i> UserStaff Detail'
            });

    }
});

/**
 * Insert
 */
Template.ice_userStaffInsert.onRendered(function () {
    // datePicker();
});

Template.ice_userStaffInsert.helpers({
    userIds: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchId = Session.get('currentBranch');
        var userIds = Ice.Collection.UserStaffs.find().map(function (user) {
            return user.userId;
        });
        var user = Meteor.users.find({_id: {$not: {$in: userIds}}, username: {$ne: 'super'}});
        user.forEach(function (u) {
            u.rolesBranch.forEach(function (r) {
                if (r == branchId) {
                    list.push({label: u.username, value: u._id});
                    return false;
                }
            });
        });
        return list;
    }
});

/**
 * Update
 */
Template.ice_userStaffUpdate.onRendered(function () {
    // datePicker();
});

Template.ice_userStaffUpdate.helpers({
    userIds: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchId = Session.get('currentBranch');
        var user = Meteor.users.find({username: {$ne: 'super'}});
        user.forEach(function (u) {
            u.rolesBranch.forEach(function (r) {
                if (r == branchId) {
                    list.push({label: u.username, value: u._id});
                    return false;
                }
            });
        });
        return list;
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    // Customer
    ice_userStaffInsert: {
        before: {
            insert: function (doc) {
                var branchId = Session.get('currentBranch');
                var prefix = branchId + "-";
                doc._id = idGenerator.genWithPrefix(Ice.Collection.UserStaffs, prefix, 3);
                doc.branchId = branchId;
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
    ice_userStaffUpdate: {
        onSuccess: function (formType, result) {
            alertify.userStaff().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

/**
 * Config date picker
 */
var datePicker = function () {
    var dob = $('[name="dob"]');
    DateTimePicker.date(dob);
};
