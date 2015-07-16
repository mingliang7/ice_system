Router.route('sample/customer', function () {

    this.render('sample_customer');

}, {
    name: 'sample.customer',
    title: "Customer",
    header: {title: 'Customer', sub: '', icon: 'list'},
    breadcrumb: {title: 'Customer', parent: 'sample.home'}
});