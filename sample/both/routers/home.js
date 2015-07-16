Router.route('sample/home', function () {
    this.render('sample_home');
}, {
    name: 'sample.home',
    title: "Home",
    header: {title: 'Home', sub: '', icon: 'home'},
    breadcrumb: {title: 'Home', parent: 'cpanel.welcome'}
});