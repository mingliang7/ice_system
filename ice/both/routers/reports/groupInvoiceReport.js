Router.route('ice/groupInvoiceReport', function () {
    this.render('ice_groupInvoiceReport');
}, {
    name: 'ice.groupInvoiceReport',
    header: {title: 'Invoice Group Report', sub: '', icon: 'file-text-o'},
    title: "Invoice Group Report"
});

Router.route('ice/groupInvoiceReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini
        // Orientation: portrait, landscape
        // Font size: fontBody: undefined (10px), bg (12px)
        data: {
            pageSize: 'a5',
            orientation: 'portrait',
            fontBody: 'bg'
        }
    });

    var q = this.params.query;
    this.render('ice_groupInvoiceReportGen', {
        data: function () {
            return q;
        }
    });
});
