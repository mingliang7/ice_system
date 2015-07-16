Router.route('cpanel/home', function () {

    this.render('cpanel_home');

}, {
    name: 'cpanel.home',
    title: "Home",
    header: {title: 'home', sub: '', icon: 'home'},
    breadcrumb: {title: 'Home', parent: 'cpanel.welcome'}
});
