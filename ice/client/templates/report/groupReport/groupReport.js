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
            {col1: '#: ' + self.id, col2: 'បុគ្គលិក: ' + '' },
            {col1: 'អតិថិជន: ' + customerDoc.name, col2: 'ប្រភេទ: ' + type},
            { col1: 'កាលបរិច្ឆេទ: ' + date, col2: 'ម៉ោង: ' + time }
        ];

        /********* Content & Footer *********/
        var content = [];
        var groupOrder = Ice.Collection.OrderGroup.findOne(self.id);
        var itemsDetail = groupOrder.groupBy;
        var dataItem = {};
        dataItem['items'] = {};
        var orderDay = '';
        for(var k in itemsDetail){
            orderDay = k.slice(3);
            for(var i in itemsDetail[k]['items']){
                if( dataItem['items'][orderDay] == undefined ) {
                    dataItem['items'][orderDay] = {};
                    dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                    dataItem['items'][orderDay].orderDate = orderDay;
                }else{    
                     dataItem['items'][orderDay][i] = itemsDetail[k]['items'][i];
                     dataItem['items'][orderDay].orderDate = orderDay;
                }
            }
            dataItem['items'][orderDay].total = itemsDetail[k].total;
            dataItem['items'][orderDay].totalInDollar = itemsDetail[k].totalInDollar;
        }
        content.push(dataItem);
        if (content.length > 0) {
            data.content = content;
            // data.footer = {
            // 	subtotal: formatNum(getOrder.subtotal),
            // 	discount: getOrder.discount == undefined ? '' : getOrder.discount + '%',
            // 	total: formatNum(getOrder.total),
            //     totalInDollar: formatNum(getOrder.totalInDollar)
            // }
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
    },
    listItems: function(items){
        var results = '';
        for(var k in items){
            results += '<tr>' + '<td>' + items[k]['orderDate'] + '</td>';
            for(var j in items[k]){
              if(items[k][j].name !== undefined){
                results += '<td>' + items[k][j].price + '</td>' + '<td>' + items[k][j].qty + '</td>' + '<td>' + items[k][j].amount + '</td>' ;
              }
            }
            results += '<td>' + items[k].total +'</td>' +'</tr>'; 
        }
        console.log(results);
        return results;
    } 
});

var formatNum = function(value){
	return numeral(value).format('0,0.00');
}