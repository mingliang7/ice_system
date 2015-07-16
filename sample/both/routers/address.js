Router.route('sample/address', function () {

    this.render('sample_address');

}, {
    name: 'sample.address',
    title: "Address",
    header: {title: 'Address', sub: '', icon: 'list'},
    breadcrumb: {title: 'Address', parent: 'sample.home'}
});