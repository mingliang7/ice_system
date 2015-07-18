Router.route('ice/paymentReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini
        // Orientation: portrait, landscape
        // Font size: fontBody: undefined (10px), bg (12px)
        data: {
            pageSize: 'a4',
            orientation: 'landscape',
            fontBody: 'bg'
        }
    });

    var q = this.params.query;
    this.render('ice_paymentReportGen', {
        data: function () {
            return q;
        }
    },{name: 'ice_paymentReportGen'});
});
