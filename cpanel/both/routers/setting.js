Router.route('cpanel/setting', function () {

    this.render('cpanel_setting', {
        data: function () {
            return Cpanel.Collection.Setting.findOne();
        }
    });

}, {
    name: 'cpanel.setting',
    title: "Setting",
    header: {title: 'setting', icon: 'cogs'},
    breadcrumb: {title: 'Setting', parent: 'cpanel.welcome'}
});