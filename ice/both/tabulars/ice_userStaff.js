Ice.TabularTable.UserStaffs = new Tabular.Table({
    name: "iceUserStaffList",
    collection: Ice.Collection.UserStaffs,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.ice_userStaffAction
        },
        {data: "_id", title: "ID"},
        {data: "userId", title: "User"},
        {
            data: "staffIds", title: "Staffs",
            render: function (val, type, doc) {
                return JSON.stringify(val);
            }
        },
        {data: "branchId", title: "Branch"},
        
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    pagingType: "full_numbers",
    autoWidth: false
});