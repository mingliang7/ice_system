Ice.TabularTable.EndOfProcess = new Tabular.Table({
    name: "iceEndOfProcess",
    collection: Ice.Collection.EndOfProcess,
    columns: [
        {
            data: "date", 
            title: "Date",
        },
        {
            data: "_user.username", 
            title: "User",
        }
        
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    pagingType: "full_numbers",
    autoWidth: false
});

