// Address
Sample.TabularTable.Address = new Tabular.Table({
    name: "sampleAddressList",
    collection: Sample.Collection.Address,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.sample_addressAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "customerCount", title: "Customer Count"}
    ]
});