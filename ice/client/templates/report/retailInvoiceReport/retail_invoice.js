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
Template.ice_invoiceReportGen.helpers({
    data: function () {
        var id = Router.current().params.id;
        var self = Ice.Collection.Order.findOne(id);
        var splitDate = self.orderDate.split(' ');
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
        var getOrder = self;
         
                // var getGroup = Ice.Collection.OrderGroup.findOne({_id: self.groupId, iceCustomerId: self.customerId, startDate: {$lt: self.endDate}, endDate:{$gt: self.startDate}});
        // dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
        
        if(self._customer.customerType !== 'general'){
            type = self._customer.customerType + ' ថ្ងៃ';
        }
        else{
            type = 'general';
        }
        data.header = [
            {col1: '#: ' + self._id, col2: 'បុគ្គលិក: ' + getOrder._staff.name },
            {col1: 'អតិថិជន: ' + self._customer.name, col2: 'ប្រភេទ: ' + type},
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
    },
    check: function(){
       
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

var formatDollar = function(value){
    return numeral(value).format('0,0.00');
}
var formatKH = function(value){
    return numeral(value).format('0,0');
}