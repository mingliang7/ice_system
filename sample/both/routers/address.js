Router.route('sample/address', function () {

    this.render('sample_address');

}, {
    name: 'sample.address',
    header: {title: 'Address', sub: '', icon: 'list'},
    title: "Address"
});