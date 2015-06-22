Router.route('sample/customer', function () {

    this.render('sample_customer');

}, {
    name: 'sample.customer',
    header: {title: 'customer', sub: '', icon: 'list'},
    title: "Customer"
});