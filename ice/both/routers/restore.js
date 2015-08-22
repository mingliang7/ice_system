Router.route('ice/restore', function () {
    this.render('ice_restore');
}, {
    name: 'ice.restore',
    header: {title: 'restore', sub: '', icon: 'files-o'},
    title:'ice-restore'
});