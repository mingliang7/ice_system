/***** Declare template *****/
var reportTpl = Template.ice_unpaidGeneral,
    generateTpl = Template.ice_unpaidGeneralGen;

/***** Form *****/
reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
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
        var addDay = new Date(self.date);
        var today = new Date(
                    addDay.getFullYear(), 
                    addDay.getMonth(), 
                    addDay.getDate() + 1)
        today = moment(today).format('YYYY-MM-DD HH:mm:ss');
        yesterday = moment(self.date).format('YYYY-MM-DD 23:59:59');
        /********** Content **********/ 
        var content = [];
        var selector = {orderDate: {$lt: today}, $or: [{closingDate: {$gt: yesterday}}, {closingDate: 'none'}]}
        var getOrder = Ice.Collection.Order.find(selector);
        var index =  1 ;
        var order = {};
        getOrder.forEach(function(obj) {
           if(obj._payment != undefined){
                var payment = _.findLastKey(obj._payment, function(payment){
                    if(payment.date < today){
                         return payment;
                    }
                });
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
                    customerName: obj._customer.name,
                    customerType: obj._customer.customerType,
                    _payment: payment
                }
            }else{
                order = {
                    _id: obj._id,
                    orderDate: obj.orderDate,
                    closingDate: obj.closingDate,
                    iceCustomerId: obj.iceCustomerId,
                    customerName: obj._customer.name,
                    customerType: obj._customer.customerType,
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
            data.content = content;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    },
    formatKh: function(val){
        return numeral(val).format('0,0');
    }
});
