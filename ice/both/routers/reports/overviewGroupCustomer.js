Router.route('ice/overviewGroupCustomer', function () {
    this.render('ice_overviewGroupCustomer');
}, {
    name: 'ice.overviewGroupCustomer',
    header: {title: 'របាយការណ៍អតិថិជនជំពាក់', sub: '', icon: 'file-text-o'},
    title: "របាយការណ៍អតិថិជនជំពាក់"
});

Router.route('ice/overviewGroupCustomerGen', function () {
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
    this.render('ice_overviewGroupCustomerGen', {
        data: function () {
            return q;
        }
    });
});
