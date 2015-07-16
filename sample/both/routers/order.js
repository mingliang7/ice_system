Router.route('sample/order', function () {

    this.render('sample_order');

}, {
    name: 'sample.order',
    title: "Order",
    header: {title: 'Order', sub: '', icon: 'list'},
    breadcrumb: {title: 'Order', parent: 'sample.home'}
});