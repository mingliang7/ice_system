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
            company: company
        };

        /********* Header ********/

        console.log(self);
        var customerDoc = Ice.Collection.Customer.findOne(self.customerId);
        var date = moment(self.date).format('YYYY-MM-DD');
        var time = moment(self.date).format('hh:mm:ss a');
        var type = '';
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
        
        if(customerDoc.customerType !== 'general'){
        	type = customerDoc.customerType + ' ថ្ងៃ';
        }
        else{
        	type = 'general';
        }
        data.header = [
            {col1: '#: ' + self.orderId, col2: 'បុគ្គលិក: ' + '' },
            {col1: 'អតិថិជន: ' + customerDoc.name, col2: 'ប្រភេទ: ' + type},
            { col1: 'កាលបរិច្ឆេទ: ' + date, col2: 'ម៉ោង: ' + time }
        ];

        /********* Content & Footer *********/
        var content = [];
        var groupOrder = Ice.Collection.OrderGroup.findOne(self.id);
        var itemsDetail = getOrder.iceOrderDetail
        itemsDetail.forEach(function (item) {
        	item.price = formatNum(item.price);
        	item.amount = formatNum(item.amount);
            item.discount = item.discount == undefined ? '' : item.discount + '%'
        	content.push(item);
        });
        content.push(itemsDetail);
        if (content.length > 0) {
            data.content = content;
            data.footer = {
            	subtotal: formatNum(getOrder.subtotal),
            	discount: getOrder.discount == undefined ? '' : getOrder.discount + '%',
            	total: formatNum(getOrder.total),
                totalInDollar: formatNum(getOrder.totalInDollar)
            }
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },

    itemName: function(id){
    	var name = Ice.Collection.Item.findOne(id).name;
    	return name;
    },
    itemDiscount: function(discount) {
    	if(discount == undefined){
   			return '';
    	}else{
    		return discount;
    	}
    }
});

var formatNum = function(value){
	return numeral(value).format('0,0.00');
}