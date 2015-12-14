Router.route('ice/returningReport', function () {
  this.render('ice_returningReport');
}, {
  name: 'ice.returningReport',
  header: {
    title: 'Returning Report',
    sub: '',
    icon: 'file-text-o'
  },
  title: "Returning Report"
});


Router.route('ice/returningReportGen', function () {
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
  this.render('ice_returningReportGen', {
    data: function () {
      return q;
    }
  }, {
    name: 'ice_returningReportGen'
  });
});
