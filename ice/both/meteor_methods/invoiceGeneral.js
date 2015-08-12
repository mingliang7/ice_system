Meteor.methods({
    generalOrder: function(params){    
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
        var selector = {iceCustomerId: self.customer, orderDate: {$gte: startDate, $lte: endDate}}
        console.log(selector);
        var getOrder = Ice.Collection.Order.find(selector).fetch();
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
       
        /********* Content & Footer *********/
        var content = [];
        getOrder.forEach(function(order) {
         var newItem = {}
            newItem.item = [];
            console.log(order);
            order.iceOrderDetail.forEach(function (item) {
                item.price = formatKH(item.price);
                item.amount = formatDollar(item.amount);
                item.discount = item.discount == undefined ? '' : item.discount + '%'
                newItem.item.push(item);
            });
            data.footer = {
                subtotal: formatKH(order.subtotal),
                discount: order.discount == undefined ? '' : order.discount,
                total: formatKH(order.total),
                totalInDollar: formatDollar(order.totalInDollar),
                paidAmount: formatKH(order.paidAmount),
                outstandingAmount: formatKH(order.outstandingAmount)
            }
            data.header = [
                {col1: '#: ' + order._id, col2: 'បុគ្គលិក: ' + order._staff.name },
                {col1: 'អតិថិជន: ' + order._customer.name, col2: 'ប្រភេទ: ' + order._customer.customerType},
                { col1: 'កាលបរិច្ឆេទ: ' + order.orderDate }
            ];
            newItem.header = data.header;
            newItem.title = data.title;
            newItem.footer = data.footer;
            content.push(newItem);
            
        });
        console.log(content);
        if (content.length > 0) {
            data.content = content;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});


var formatDollar = function(value){
    return numeral(value).format('0,0.00');
}
var formatKH = function(value){
    return numeral(value).format('0,0');
}