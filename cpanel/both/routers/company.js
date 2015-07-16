Router.route('cpanel/company', function () {

    this.render('cpanel_company', {
        data: function () {
            return Cpanel.Collection.Company.findOne();
        }
    });

}, {
    name: 'cpanel.company',
    title: "Company",
    header: {title: 'company', icon: 'briefcase'},
    breadcrumb: {title: 'Company', parent: 'cpanel.welcome'}
});