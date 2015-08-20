Meteor.methods({
    generalOrder: function(params) {
        var self = params;
        var data = {
            title: {},
            header: [],
            content: [],
            footer: {},
        };
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.khName,
            address: company.khAddress,
            telephone: company.telephone
        };
        /********* Title *********/
        /********* Header ********/
        var date = self.date.split(' To ');
        var startDate = date[0];
        var endDate = date[1];
        var selector = {
            iceCustomerId: self.customer,
            orderDate: {
                $gte: startDate,
                $lte: endDate
            }
        }
        var getOrder = Ice.Collection.Order.find(selector, {sort: {orderDate: 1}}).fetch();
        // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
        /********* Content & Footer *********/
        var content = [];
        var subTotal = 0;
        var discount = 0;
        var total = 0;
        var totalInDollar = 0;
        var outstandingAmount = 0;
        var paidAmount = 0;
        var listItemByDate = undefined;
        index = 0;
        var currentObj = {};
        var newItem = {}
        newItem.item = [];
        getOrder.forEach(function(order) {
            var tempDate = order.orderDate.split(' '); 
            order.iceOrderDetail.forEach(function(item) {
                if (_.isUndefined(currentObj[tempDate[0]])) {
                    currentObj[tempDate[0]] = {};
                    if (_.isUndefined(currentObj[tempDate[0]][item.iceItemId])) {
                        currentObj[tempDate[0]][item.iceItemId] = {
                            price: item.price,
                            qty: item.qty,
                            amount: item.amount
                        }
                    }
                } else {
                    if (!_.isUndefined(currentObj[tempDate[0]][item.iceItemId])) {
                        currentObj[tempDate[0]][item.iceItemId] = {
                            price: item.price,
                            qty: currentObj[tempDate[0]][item.iceItemId].qty += item.qty,
                            amount: currentObj[tempDate[0]][item.iceItemId].amount += item.amount
                        }
                    } else {
                        currentObj[tempDate[0]][item.iceItemId] = {
                            price: item.price,
                            qty: item.qty,
                            amount: item.amount
                        }
                    }
                }
            });
            data.footer = {
                subtotal: formatKH(subTotal += order.subtotal),
                discount: order.discount == undefined ? '' : discount += order.discount,
                total: formatKH(total += order.total),
                totalInDollar: formatDollar(totalInDollar += order.totalInDollar),
                paidAmount: formatKH(paidAmount += order.paidAmount),
                outstandingAmount: formatKH(outstandingAmount += order.outstandingAmount)
            }
            data.header = [{
                col1: '#: ' + order._id,
                col2: 'បុគ្គលិក: ' + order._staff.name
            }, {
                col1: 'អតិថិជន: ' + order._customer.name,
                col2: 'ប្រភេទ: ' + order._customer.customerType
            }, {
                col1: 'កាលបរិច្ឆេទ: ' + self.date
            }];
        });
        listItemByDate = extractItemByDate(currentObj);
        newItem.content = listItemByDate.content;
        newItem.header = data.header;
        newItem.title = data.title;
        newItem.footer = data.footer;
        content.push(newItem);
        if (content.length > 0) {
            data.content = content;
            return data;
        } else {
            data.content.push({
                index: 'no results'
            });
            return data;
        }
    }
});
var formatDollar = function(value) {
    return numeral(value).format('0,0.00');
}
var formatKH = function(value) {
    return numeral(value).format('0,0');
}
var extractItemByDate = function(currentObj) {
    var td = '';
    var itemByDate = {};
    var itemTotalDetail = {};
    Ice.Collection.Item.find().fetch().forEach(function(obj) {
        itemTotalDetail[obj._id] = {
            qty: '',
            amount: '',
            price: '',
        }
        for (var j in currentObj) {
            if (itemByDate[j] == undefined) {
                itemByDate[j] = {}
                itemByDate[j][obj._id] = {
                    name: obj.name,
                    price: '',
                    qty: '',
                    amount: '',
                }
            }else{
                itemByDate[j][obj._id] = {
                    name: obj.name,
                    price: '',
                    qty: '',
                    amount: '',
                }
            }
        }
    });
    for (var k in currentObj) {
        for (var j in currentObj[k]) {
            itemTotalDetail[j] = {
                price: currentObj[k][j].price,
                amount: itemTotalDetail[j].amount == '' ? currentObj[k][j].amount : itemTotalDetail[j].amount + currentObj[k][j].amount,
                qty: itemTotalDetail[j].qty == '' ? currentObj[k][j].qty : itemTotalDetail[j].qty + currentObj[k][j].qty
            }
            itemByDate[k][j] = {
                name: itemByDate[k][j].name,
                price: currentObj[k][j].price,
                qty: itemByDate[k][j].qty == '' ? currentObj[k][j].qty : itemByDate[k][j].qty += currentObj[k][j].qty,
                amount: itemByDate[k][j].amount == '' ? currentObj[k][j].qty : itemByDate[k][j].amount += currentObj[k][j].amount
            }
        }
    }
    for (var i in itemByDate) {
        var amount = 0 ;
        td += '<tr style="border-bottom: 1px solid #000;">' + '<td>' + i + '</td>';
        for (var j in itemByDate[i]) {
            if (itemByDate[i][j].amount != '') {
                if (itemByDate[i][j].name != 'ទឹកកកដើម (ដើម)') {
                    td += '<td >' + itemByDate[i][j].qty + ' kg' + '</td>';
                } else {
                    td += '<td>' + itemByDate[i][j].qty + ' ដើម' + '</td>'
                }
            } else {
                td += '<td></td>'
            }
        }
        td += '</tr>'
    }
    td += '<br>';
    td += '<tr><td>ចំនួនសរុប:</td>';
    for(var j in itemTotalDetail) {
        if(itemTotalDetail[j]){
            td += '<td>' + itemTotalDetail[j].qty + '</td>';
        }else{
            td += '<td></td>';
        }
    }
    td += '</tr>';
    td += '<tr><td>តម្លៃ:</td>';
    for(var j in itemTotalDetail){
        if(itemTotalDetail[j].price){
            td += '<td>' + itemTotalDetail[j].price + '</td>';
        }else{
            td += '<td></td>';
        }
    }
    td += '</tr>'
    td += '<tr><td>សរុបទឹកប្រាក់:</td>';   
    for(var j in itemTotalDetail){
        if(itemTotalDetail[j].amount){
            td += '<td>' + itemTotalDetail[j].amount + '</td>';
        }else{
            td += '<td></td>';
        }
    }
    td += '</tr>';
    return {
        content: td
    };
}