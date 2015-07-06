Router.route('ice/invoiceGroupReport', function () {
    this.render('ice_invoiceGroupReport');
}, {
    name: 'ice.invoiceGroupReport',
    header: {title: 'Invoice Report', sub: '', icon: 'file-text-o'},
    title: "Invoice Group Report"
});

Router.route('ice/invoiceGroupReportGen', function () {
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
    this.render('ice_invoiceGroupReportGen', {
        data: function () {
            return q;
        }
    });
});
