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
        var getOrder = Ice.Collection.Order.find(selector).fetch();
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
       
        /********* Content & Footer *********/
        var content = [];
        var subTotal = 0 ; 
        var discount = 0 ;
        var total = 0 ;
        var totalInDollar = 0 ;
        var outstandingAmount = 0 ;
        var paidAmount = 0;
        index = 0 ;
        var currentObj = {};   
        var newItem = {}
        newItem.item = [];
        getOrder.forEach(function(order) {
            order.iceOrderDetail.forEach(function (item) {
                if(index == 0 ){
                     currentObj[item.iceItemId] ={
                            price: item.price,
                            qty: item.qty,
                            amount: item.amount
                        }
                }else{
                    if(currentObj[item.iceItemId] != undefined){
                        currentObj[item.iceItemId] ={
                            price: item.price,
                            qty: currentObj[item.iceItemId].qty += item.qty,
                            amount: currentObj[item.iceItemId].amount += item.amount
                        }
                    }else{
                        currentObj[item.iceItemId] ={
                            price: item.price,
                            qty: item.qty,
                            amount: item.amount
                        }
                    }
                }
                index++;
            });
            data.footer = {
                subtotal: formatKH(subTotal += order.subtotal),
                discount: order.discount == undefined ? '' : discount += order.discount,
                total: formatKH(total += order.total),
                totalInDollar: formatDollar(totalInDollar += order.totalInDollar),
                paidAmount: formatKH(paidAmount += order.paidAmount),
                outstandingAmount: formatKH(outstandingAmount += order.outstandingAmount)
            }
            data.header = [
                {col1: '#: ' + order._id, col2: 'បុគ្គលិក: ' + order._staff.name },
                {col1: 'អតិថិជន: ' + order._customer.name, col2: 'ប្រភេទ: ' + order._customer.customerType},
                { col1: 'កាលបរិច្ឆេទ: ' + order.orderDate }
            ];
        });
        for(var k in currentObj){
            var obj = {}
                obj[k] = currentObj[k]  
            newItem.item.push(obj);
        }
        newItem.header = data.header;
        newItem.title = data.title;
        newItem.footer = data.footer;
        console.log(newItem);
        content.push(newItem);
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