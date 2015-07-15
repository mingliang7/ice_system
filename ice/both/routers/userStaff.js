Router.route('ice/userStaff', function () {
    this.render('ice_userStaff');

}, {
    name: 'ice.userStaff',
    header: {title: 'User Staff Mapping', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posUserStaff');
    },
    title:'pos-user-staff'
});