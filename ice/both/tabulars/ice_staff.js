Ice.TabularTable.Staffs = new Tabular.Table({
    name: "iceStaffList",
    collection: Ice.Collection.Staffs,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.ice_userStaffAction
        },
        {data: "_id", title: "ID"},
        {
            data: "name", title: "Name",
        },
        {data: "gender", title: "Gender"},
        {data: "position", title: "Position"},
        {data: "telephone", title: "Telephone"},
        {data: "address", title: "Address"}
       
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    pagingType: "full_numbers",
    autoWidth: false
});