Router.route('sample/order', function () {

    this.render('sample_order');

}, {
    name: 'sample.order',
    header: {title: 'order', sub: '', icon: 'list'},
    title: "order"
});