Router.route('ice/invoiceReport', function () {
    this.render('ice_invoiceReport');
}, {
    name: 'ice.invoiceReport',
    header: {title: 'Invoice Report', sub: '', icon: 'file-text-o'},
    title: "Invoice Report"
});

Router.route('ice/invoiceReportGen/:id', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini
        // Orientation: portrait, landscape
        // Font size: fontBody: undefined (10px), bg (12px)
        data: {
            pageSize: 'mini',
            orientation: 'portrait',
            fontBody: 'bg'
        }
    });


    this.render('ice_invoiceReportGen', {
      
    },{name: 'ice.invoiceReportGen'});
});
