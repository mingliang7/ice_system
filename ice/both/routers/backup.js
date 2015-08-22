Router.route('ice/backup', function () {
    this.render('ice_backup');
}, {
    name: 'ice.backup',
    header: {title: 'Backup', sub: '', icon: 'files-o'},
    title:'ice-backup'
});
