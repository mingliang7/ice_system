var dataState = new ReactiveVar();
Template.ice_groupInvoiceReportInsert.onRendered(function () {
    datePicker();
});

Template.ice_groupInvoiceReportInsert.events({
    'change [name="staffId"]': function (e) {
        value = $(e.currentTarget).val();
        return Ice.ListForReportState.set('staffId', value);
    },
    'change [name="customerType"]': function (e) {
        value = $(e.currentTarget).val();
        return Ice.ListForReportState.set('customerType', value);
    },
    'change [name="date"]': function (e) {
        value = $('[name="date"]').val().split(' To ')
        Ice.ListForReportState.set('dateRange', value);
    },
    'keyup [name="date"]': function (e) {
        value = $('[name="date"]').val().split(' To ')
        Ice.ListForReportState.set('dateRange', value);
    }
});
Template.ice_groupInvoiceReportInsert.helpers({
    customerOption: function () {
        type = Ice.ListForReportState.get('customerType');
        console.log(type);
        if (!_.isEmpty(type)) {
            return ReactiveMethod.call('customerByType', type);
        } else {
            return [{
                label: 'All',
                value: ''
            }];
        }
    }
});
Template.ice_groupInvoiceReportInsert.onDestroyed(function () {
    Ice.ListForReportState.set('customerType', undefined);
});
Template.ice_groupInvoiceReportGen.created = function () {
    this.autorun(function () {
        Meteor.call('groupInvoiceReport', Router.current().params.query, function (err, result) {
            dataState.set(result);
        });
    })
};
Template.ice_groupInvoiceReportGen.helpers({
    data: function () {
        if (dataState.get()) {
            return dataState.get();
        }
        return false;
    },
    placeQty: function (itemDoc) {
        var concat = '';
        var itemObj = {};
        var data = dataState.get();
        data.displayFields.forEach(function (obj) {
            itemObj[obj.itemId] = {
                qty: 0
            }
        });
        itemDoc.forEach(function (item) {
            itemObj[item.itemId].qty += item.sumQty
        });
        for (var k in itemObj) {
            var quantity = itemObj[k].qty == 0 ? '' : itemObj[k].qty;
            concat += '<td align="center">' + quantity + '</td>';
        }
        return concat;
    },
    extractTotalQty: function (itemDoc) {
        var data = dataState.get();
        return extractItems(data, itemDoc, 'totalQty')
    },
    extractAvgPrice: function (itemDoc) {
        var data = dataState.get();
        return extractItems(data, itemDoc, 'avgPrice')
    },
    extractTotalAmount: function (itemDoc) {
        var data = dataState.get();
        return extractItems(data, itemDoc, 'totalAmount')
    }
});
var datePicker = function () {
    var date;
    date = $('[name="date"]');
    DateTimePicker.dateRange(date);
};

function extractItems(data, itemDoc, property) {
    var concat = '';
    var itemObj = {};
    data.displayFields.forEach(function (obj) {
        itemObj[obj.itemId] = {
            qty: 0
        }
    });
    itemDoc.forEach(function (item) {
        itemObj[item.itemId].qty += item[property]
    });
    for (var k in itemObj) {
        var fieldToDisplay = itemObj[k].qty == 0 ? '' : numeral(itemObj[k].qty).format('0,0');
        concat += '<td align="center"><b>' + fieldToDisplay + '</b></td>';
    }
    return concat;
}