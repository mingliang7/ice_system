// Dental.ListForReportState = new ReactiveObj();
// /************ Form *************/
// Template.dental_invoiceReport.onCreated(function () {
//     createNewAlertify('exchange');
// });

// Template.dental_invoiceReport.onRendered(function () {
//     var name = $('[name="date"]');
//     DateTimePicker.date(name);
// });

// Template.dental_invoiceReport.events({
//     'click .exchangeAddon': function (e, t) {
//         alertify.exchange(fa("plutoJSONValue(val);s", "Exchange"), renderTemplate(Template.cpanel_exchangeInsert));
//     },
//     'change .patientId': function (e, t) {
//         var patientId = $(e.currentTarget).val();
//         return Dental.ListForReportState.set("patientId", patientId);
//     }

// });
/************ Generate *************/
Template.ice_invoiceGroupReportGen.helpers({
    data: function () {
        var self = this;
        var data = {
            title: {},
            header: [],
            content: [],
            footer: [],
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.khName,
            address: company.khAddress,
            telephone: company.telephone
        };

        /********* Header ********/

        var customerDoc = Ice.Collection.Customer.findOne(self.customerId);
        var date = moment(self.date).format('YYYY-MM-DD');
        var endDate = moment(self.endDate).format('YYYY-MM-DD');
        var time = moment(self.date).format('hh:mm:ss a');
        var type = '';

        // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;

        if (customerDoc.customerType !== 'general') {
            type = customerDoc.customerType + ' ថ្ងៃ';
        }
        else {
            type = 'general';
        }
        data.header = [
            {col1: '#: ' + self.id, col2: 'បុគ្គលិក: ' + ''},
            {col1: 'អតិថិជន: ' + customerDoc.name, col2: 'ប្រភេទ: ' + type},
            {col1: 'កាលបរិច្ឆេទ: ' + date +" ដល់ " + endDate, col2: 'ម៉ោង: ' + time}
        ];

        /********* Content & Footer *********/
        var content = [];
        var groupOrder = Ice.Collection.OrderGroup.findOne(self.id);
        var itemsDetail = groupOrder.groupBy;
        contentDetail(content, itemsDetail); //function call
        var totalItem = itemTotalDetail(itemsDetail);//function call
        if (content.length > 0) {
            data.content = content;
            data.footer = {
                // subtotal: formatNum(groupOrder.subtotal),
                // discount: groupOrder.discount == undefined ? '' : groupOrder.discount + '%',
                total: formatKhmerCurrency(groupOrder.total),
                totalInDollar: formatNum(groupOrder.totalInDollar),
                paidAmount: formatKhmerCurrency(groupOrder.paidAmount),
                outstandingAmount: formatKhmerCurrency(groupOrder.outstandingAmount)
            }
            data.totalDetail = {
                qty: extractTotalQty(totalItem),
                price: extractPrice(totalItem),
                amount: extractTotalAmount(data.footer.total, totalItem)
            }
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },

    itemName: function (id) {
        var name = Ice.Collection.Item.findOne(id).name;
        return name;
    },
    itemDiscount: function (discount) {
        if (discount == undefined) {
            return '';
        } else {
            return discount;
        }
    },
    listItems: function (items) {
        var results = '';
        for (var k in items) {
            results += '<tr>' + '<td>' + items[k]['orderDate'] + '</td>';
            for (var j in items[k]) {
                if (items[k][j].name !== undefined && items[k][j].name !== 'ទឹកកកដើម (ដើម)') {
                    results += '<td>' + +items[k][j].qty + 'kg' + '</td>';
                } else if (items[k][j].name !== undefined && items[k][j].name == 'ទឹកកកដើម (ដើម)') {
                    results += '<td>' + +items[k][j].qty + 'ដើម' + '</td>';
                }
            }
        }
        return results;
    }
});

// functions 
var formatNum = function (value) {
    return numeral(value).format('0,0.00');
}
var formatKhmerCurrency = function (value) {
    return numeral(value).format('0,0');
}


var contentDetail = function (content, itemsDetail) {
    var dataItem = {};
    dataItem['items'] = {};
    var orderDay = '';
    for (var k in itemsDetail) {
        orderDay = k.slice(3);
        for (var i in itemsDetail[k]['items']) {
            if (dataItem['items'][orderDay] == undefined) {
                dataItem['items'][orderDay] = {};
                dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                dataItem['items'][orderDay].orderDate = orderDay;
            } else {
                dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                dataItem['items'][orderDay].orderDate = orderDay;
            }
        }
        dataItem['items'][orderDay].total = itemsDetail[k].total;
        dataItem['items'][orderDay].totalInDollar = itemsDetail[k].totalInDollar;
    }
    return content.push(dataItem);
}

var itemTotalDetail = function (itemsDetail) {
    var itemSubTotal = {};
    itemSubTotal.qty = {};
    itemSubTotal.price = {}
    itemSubTotal.amount = {};
    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] = 0;
            itemSubTotal.amount[i] = 0;
        }
    }

    for (var k in itemsDetail) {
        for (var i in itemsDetail[k]['items']) {
            itemSubTotal.qty[i] += itemsDetail[k]['items'][i].qty;
            itemSubTotal.price[i] = itemsDetail[k]['items'][i].price
            itemSubTotal.amount[i] += itemsDetail[k]['items'][i].amount
        }
    }
    return itemSubTotal;
}

var extractTotalQty = function (totalItem) {
    var qty = '';
    for (var i in totalItem.qty) {
        qty += '<td>' + formatNum(totalItem.qty[i]) + '</td>';
    }
    return qty;
}
var extractPrice = function (totalItem) {
    var price = '';
    for (var i in totalItem.price) {
        price += '<td>' + formatKhmerCurrency(totalItem.price[i]) + '</td>';
    }
    return price;
}
var extractTotalAmount = function (total, totalItem) {
    var amount = '';
    for (var i in totalItem.amount) {
        amount += '<td>' + formatNum(totalItem.amount[i]) + '</td>';
    }
    // amount += '<td>' + '<strong>' + total + '</strong>' + '</td>'
    return amount;
}