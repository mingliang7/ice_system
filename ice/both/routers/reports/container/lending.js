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
