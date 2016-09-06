Router.route('ice/receivePaymentReport', function () {
    this.render('ice_receivePaymentReport');
}, {
    name: 'ice.receivePaymentReport',
    header: {title: 'របាយការណ៍បង់ប្រាក់អតិថិជនក្រុម', sub: '', icon: 'file-text-o'},
    title: "របាយការណ៍បង់ប្រាក់អតិថិជនក្រុម"
});

Router.route('ice/receivePaymentReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini
        // Orientation: portrait, landscape
        // Font size: fontBody: undefined (10px), bg (12px)
        data: {
            pageSize: 'a4',
            orientation: 'portrait',
            fontBody: 'bg'
        }
    });

    var q = this.params.query;
    this.render('ice_receivePaymentReportGen', {
        data: function () {
            return q;
        }
    });
});
