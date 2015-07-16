Router.route('/', function () {

    this.render('cpanel_welcome');

}, {
    name: 'cpanel.welcome',
    title: "Welcome",
    header: {title: 'welcome', sub: '', icon: 'dashboard'},
    breadcrumb: {title: 'Welcome'}
});
