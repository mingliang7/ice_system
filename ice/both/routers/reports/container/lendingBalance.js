//lending report
Router.route('ice/lendingBalanceReport', function () {
  this.render('ice_lendingBalanceReport');
}, {
  name: 'ice.lendingBalanceReport',
  header: {
    title: 'Lending Balance',
    sub: '',
    icon: 'file-text-o'
  },
  title: "Lending Balance"
});


Router.route('ice/lendingBalanceReportGen', function () {
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
  this.render('ice_lendingBalanceReportGen', {
    data: function () {
      return q;
    }
  }, {
    name: 'ice_lendingBalanceReportGen'
  });
});
