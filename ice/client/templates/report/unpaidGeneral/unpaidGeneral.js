/***** Declare template *****/
// sort function
function compare(a,b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}

var reportTpl = Template.ice_unpaidGeneral,
    generateTpl = Template.ice_unpaidGeneralGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

/***** Generate ******/
generateTpl.helpers({
    data: function () {
        var self = this;
        var data = {
            title: {},
            header: {},
            content: [],
            footer: {}
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.enName
        };

        /********* Header ********/
        data.header = self;
        var staff = self.staff == '' ? '' : self.staff;
        var addDay = new Date(self.date);
        var today = new Date(
                    addDay.getFullYear(), 
                    addDay.getMonth(), 
                    addDay.getDate() + 1)
        today = moment(today).format('YYYY-MM-DD HH:mm:ss');
        yesterday = moment(self.date).format('YYYY-MM-DD 23:59:59');
        /********** Content **********/ 
        var content = [];
        var index =  1 ;
        var order = {};
        var selector = {}
        if(staff == ''){
            selector = {orderDate: {$lt: today}, $or: [{closingDate: {$gt: yesterday}}, {closingDate: 'none'}]}
        }else{
            selector = {iceStaffId: staff, orderDate: {$lt: today}, $or: [{closingDate: {$gt: yesterday}}, {closingDate: 'none'}]}       
        }
        var getOrder = Ice.Collection.Order.find(selector);
        getOrder.forEach(function(obj) {
           if(obj._payment != undefined){
                var payment = _.findLastKey(obj._payment, function(payment){
                    if(payment.date < today){
                         return payment;
                    }
                });
                if(payment != undefined){
                    var payment = {
                        dueAmount: obj.total,
                        paidAmount: obj.total - obj._payment[payment].outstandingAmount,
                        outstandingAmount: obj._payment[payment].outstandingAmount
                    }
                    order = {
                        _id: obj._id,
                        orderDate: obj.orderDate,
                        closingDate: obj.closingDate,
                        iceCustomerId: obj.iceCustomerId,
                        customerName: obj._customer.name + ' (' + obj._customer.customerType + ')',
                        staffName: obj._staff.name,
                        _payment: payment
                    }
                }
            }else{
                order = {
                    _id: obj._id,
                    orderDate: obj.orderDate,
                    closingDate: obj.closingDate,
                    iceCustomerId: obj.iceCustomerId,
                    customerName: obj._customer.name + ' (' + obj._customer.customerType + ')',
                    staffName: obj._staff.name,
                    _payment:{
                        outstandingAmount: obj.outstandingAmount,
                        paidAmount: obj.paidAmount,
                        dueAmount: obj.total
                    }
                }
                
            }
            content.push(order);
        });
        if (content.length > 0) {
            var sortContent = content.sort(compare)
            data.content = sortContent;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },
    formatKh: function(val){
        return numeral(val).format('0,0');
    },
    totalAmount: function(content) {
        dueAmount = 0 ;
        paidAmount = 0 ;
        outstandingAmount = 0;
        content.forEach(function(elem) {
            dueAmount += elem._payment.dueAmount;
            paidAmount += elem._payment.paidAmount;
            outstandingAmount +=elem._payment.outstandingAmount;
        });
        return '<td><strong>' + formatKh(dueAmount) + '</strong></td>' + '<td><strong>' + formatKh(paidAmount) + '</strong></td>' + 
            '<td><strong>' + formatKh(outstandingAmount) + '</strong></td>';

    }
});



var formatKh = function(value){
    return numeral(value).format('0,0');
}