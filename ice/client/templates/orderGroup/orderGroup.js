Template.ice_orderGroup.events({
  "click .remove": function() {
    var doc = this;
    var currentUserId = Meteor.userId();
    Meteor.call('getCurrentUserRole', currentUserId, function(err, result) {
      if (result) {
        if (doc.outstandingAmount === 0) {
          alertify.confirm(
            fa('remove', 'Remove Order-Group'),
            'Are you sure to delete #' + doc._id + ' ?',
            function() {
              Meteor.call('removeOrderRelatedToGroup', doc._id);
            },
            null);
        } else {
          alertify.warning('Sorry order #' + doc._id +
            ' has payment!');
        }
      } else {
        alertify.warning('Ask your admin to remove #' + doc._id);
      }
    });
  },
  'click .show': function() {
    var doc = this;
    alertify.alert(fa('eye', 'Order detail'), renderTemplate(Template.ice_orderGroupShowTemplate,
      doc));

  }
});

Template.ice_orderGroupShowTemplate.helpers({
  extract: function(groupBy) {
    var concate = '';
    for (var key in groupBy) {
      for (var i in groupBy[key].items) {
        if (groupBy[key].items[i].qty !== 0) {
          var price = groupBy[key].items[i].price;
          var qty = groupBy[key].items[i].qty;
          var discount = groupBy[key].items[i].discount;
          var amount = groupBy[key].items[i].amount;
          concate += itemQuery.detail(i, price, qty, discount,
            amount);
        }
      }
    }
    return concate;
  }
});
itemQuery = {
  detail: function(itemId, price, qty, discount, amount) {
    discount = discount === undefined ? 0 : discount;
    name = Ice.Collection.Item.findOne(itemId).name;
    return "<small>Name: " + name + ', ' +
      "Price: " + price + ', ' +
      "Qty: " + qty + ', ' +
      "Discount: " + discount + ', ' +
      "Amount: " + amount + "</small>";
  }
};
