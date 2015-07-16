Router.route('cpanel/user', function () {

    this.render('cpanel_user');

}, {
    name: 'cpanel.user',
    title: "User",
    header: {title: 'user', sub: '', icon: 'users'},
    breadcrumb: {title: 'User', parent: 'cpanel.welcome'}
});
