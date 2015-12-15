//lending contract
Router.route('ice/lendingContractReportGen/:lendingId', function () {
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

  this.render('ice_lendingContractReportGen', {}, {
    name: 'ice_lendingContractReportGen'
  });
});
//lending report
Router.route('ice/lendingReport', function () {
  this.render('ice_lendingReport');
}, {
  name: 'ice.lendingReport',
  header: {
    title: 'Lending Report',
    sub: '',
    icon: 'file-text-o'
  },
  title: "Lending Report"
});


Router.route('ice/lendingReportGen', function () {
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
  this.render('ice_lendingReportGen', {
    data: function () {
      return q;
    }
  }, {
    name: 'ice_lendingReportGen'
  });
});
