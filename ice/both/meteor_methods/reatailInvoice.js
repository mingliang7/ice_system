Meteor.methods({
	 reatailInvoice: function (params) {
        var self = params;
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
        var time = moment(self.date).format('HH:mm:ss');
        var type = '';
        var getOrder = Ice.Collection.Order.findOne(self.orderId);
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
        
        if(customerDoc.customerType !== 'general'){
            type = customerDoc.customerType + ' ថ្ងៃ';
        }
        else{
            type = 'general';
        }
        data.header = [
            {col1: '#: ' + self.orderId, col2: 'បុគ្គលិក: ' + getOrder._staff.name },
            {col1: 'អតិថិជន: ' + customerDoc.name, col2: 'ប្រភេទ: ' + type},
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
});


var formatDollar = function(value){
    return numeral(value).format('0,0.00');
}
var formatKH = function(value){
    return numeral(value).format('0,0');
}