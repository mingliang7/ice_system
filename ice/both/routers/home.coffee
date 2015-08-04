Router.route 'ice/home',
  ->
    @render 'ice_orderInsertTemplate'

  name: 'ice.home'
  header:
    title: 'Order'
    sub: ''
icon: 'home'
title: "order"

