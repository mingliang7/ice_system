Router.route('cpanel/exchange', function () {

    this.render('cpanel_exchange');

}, {
    name: 'cpanel.exchange',
    title: "Exchange",
    header: {title: 'exchange', icon: 'exchange'},
    breadcrumb: {title: 'Exchange', parent: 'cpanel.welcome'}
});
