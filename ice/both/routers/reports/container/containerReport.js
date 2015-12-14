Router.route('ice/containerReport', function () {
  this.render('ice_containerReport');
}, {
  name: 'ice.containerReport',
  header: {
    title: 'Container Report',
    sub: '',
    icon: 'file-text-o'
  },
  title: "Container Report"
});


Router.route('ice/containerReportGen', function () {
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
  this.render('ice_containerReportGen', {
    data: function () {
      return q;
    }
  }, {
    name: 'ice_containerReportGen'
  });
});
