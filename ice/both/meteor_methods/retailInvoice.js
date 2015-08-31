Meteor.methods({
	retailInvoice: function(id){
		var getOrder = Ice.Collection.Order.findOne(id);
        var splitDate = getOrder.orderDate.split(' ');
        var date = splitDate[0];
        var time = splitDate[1];
        console.log(splitDate);
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
        var type = '';
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: getOrder.groupId, iceCustomerId: getOrder.customerId, startDate: {$lt: getOrder.endDate}, endDate:{$gt: getOrder.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
        
        if(getOrder._customer.customerType !== 'general'){
            type = getOrder._customer.customerType + ' ថ្ងៃ';
        }
        else{
            type = 'general';
        }
        data.header = [
            {col1: '#: ' + getOrder._id, col2: 'បុគ្គលិក: ' + getOrder._staff.name },
            {col1: 'អតិថិជន: ' + getOrder._customer.name, col2: 'ប្រភេទ: ' + type},
            { col1: 'កាលបរិច្ឆេទ: ' + date, col2: 'ម៉ោង: ' + time }
        ];

        /********* Content & Footer *********/
        var content = [];
        var itemsDetail = getOrder.iceOrderDetail
        itemsDetail.forEach(function (item) {
            item.price = formatKH(item.price);
            item.amount = formatDollar(item.amount);
            item.discount = item.discount == undefined ? '' : item.discount + '%'
            content.push(item);
        });
        content.push(itemsDetail);
        if (content.length > 0) {
            data.content = content;
            data.footer = {
                subtotal: formatKH(getOrder.subtotal),
                discount: getOrder.discount == undefined ? '' : getOrder.discount,
                total: formatKH(getOrder.total),
                totalInDollar: formatDollar(getOrder.totalInDollar),
                paidAmount: formatKH(getOrder.paidAmount),
                outstandingAmount: formatKH(getOrder.outstandingAmount)
            }
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
	}
})
var formatDollar = function(value){
    return numeral(value).format('0,0.00');
}
var formatKH = function(value){
    return numeral(value).format('0,0');
}