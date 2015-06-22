// Customer
Sample.TabularTable.Customer = new Tabular.Table({
    name: "sampleCustomerList",
    collection: Sample.Collection.Customer,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.sample_customerAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {data: "dob", title: "Date of Birth"},
        {data: "_address.name", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {data: "email", title: "Email"},
        {
            data: "photo",
            title: "Photo",
            render: function (val, type, doc) {
                if (_.isUndefined(val)) {
                    return null;
                } else {
                    var img = Files.findOne(val);
                    return '<img src="' + img.url() + '" class="img-thumbnail" width="50px" height="50px">';
                }
            }
        }
    ]
});