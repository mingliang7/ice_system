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
        	type = customerDoc.customerType + ' days';
        }
        else{
        	type = 'general';
        }
        data.header = [
            {col1: '#: ' + self.orderId },
            {col1: 'Staff: ' + '', col2: 'Name: ' + customerDoc.name, col3: 'Type: ' + type},
            { col1: 'Date: ' + date, col2: 'Time: ' + time }
        ];

        /********* Content & Footer *********/
        var content = [];

        

        if (content.length > 0) {
            data.content = content;
            data.footer = [
                {col1: 'Subtotal:', col2: numeral(getInvoice.subtotal).format('$0,0.00')},
                {col1: 'Deposit:', col2: numeral(getInvoice.deposit).format('$0,0.00')},
                {col1: 'Discount:', col2: numeral(getInvoice.subDiscount).format('0,0.00')},
                {col1: 'Total:', col2: numeral(getInvoice.total).format('$0,0.00')}
            ];

            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});
