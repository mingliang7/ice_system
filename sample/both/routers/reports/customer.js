// Router
Router.route('sample/customerReport', function () {
    this.render('sample_customerReport');
}, {
    name: 'sample.customerReport',
    title: "Customer",
    header: {title: 'Customer', sub: '', icon: 'file-text-o'},
    breadcrumb: {title: 'Customer', parent: 'sample.home'}
});

Router.route('sample/customerReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini
        // Orientation: portrait, landscape
        // Font size: fontBody: undefined (10px), bg (12px)
        data: {
            pageSize: 'a5',
            orientation: 'portrait',
            // Don't define if using default size
            fontBody: 'bg'
        }
    });

    // Render template
    var q = this.params.query;
    this.render('sample_customerReportGen', {
        data: function () {
            return q;
        }
    });
}, {
    name: 'sample.customerReportGen'
});
