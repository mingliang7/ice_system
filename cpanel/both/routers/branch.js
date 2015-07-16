Router.route('cpanel/branch', function () {

    this.render('cpanel_branch');

}, {
    name: 'cpanel.branch',
    title: "Branch",
    header: {title: 'branch', sub: '', icon: 'sitemap'},
    breadcrumb: {title: 'Branch', parent: 'cpanel.welcome'}
});
