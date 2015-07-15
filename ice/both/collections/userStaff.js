Ice.Collection.UserStaffs = new Mongo.Collection("ice_userStaffs");
Ice.Schema.UserStaffs = new SimpleSchema({
    userId: {
        type: String,
        label: "User",
        autoform:{
            type:"select2"
            /*options:function(){
                return Ice.List.getUserByBranchId(true);
            }*/
        }
    },
    staffIds: {
        type: [String],
        label: "Staffs",
        autoform: {
            type: "select-multiple",
            options: function () {
                return Ice.List.getStaffListByBranchId(false);
            }
        }
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    createdAt: {
        type: Date,
        label: "Created Date",
        autoValue: function () {
            if (this.isInsert)
                return new Date;
        },
        denyUpdate: true,
        optional: true
    },
    updatedAt: {
        type: Date,
        label: "Updated Date",
        autoValue: function () {
            return new Date();
        },
        optional: true
    },
    createdUserId: {
        type: String,
        label: "Created by",
        autoValue: function () {
            if (this.isInsert)
                return Meteor.user()._id;
        },
        denyUpdate: true,
        optional: true
    },
    updatedUserId: {
        type: String,
        label: "Updated by",
        autoValue: function () {
            return Meteor.user()._id;
        },
        optional: true
    }
});
Ice.Collection.UserStaffs.attachSchema(Ice.Schema.UserStaffs);
