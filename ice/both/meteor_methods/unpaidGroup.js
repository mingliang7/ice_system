// sort function
function compare(a,b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}
Meteor.methods({
     unpaidGroup: function (params) {
        var self = params;
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
        today = moment(today).format('YYYY-MM-DD');
        yesterday = moment(self.date).format('YYYY-MM-DD 23:59:59');
        /********** Content **********/ 
        var content = [];
        var selector = {endDate: {$lt: today}, $or: [{closingDate: {$gt: yesterday}}, {closingDate: 'none'}]}
        var getOrder = Ice.Collection.OrderGroup.find(selector);
        var index =  1 ;
        var order = {};
        getOrder.forEach(function(obj) {
           if(obj._payment != undefined){
                var payment = _.findLastKey(obj._payment, function(payment){
                    if(payment.date < today){
                         return payment;
                    }
                });
                if(payment != undefined){
                    var paymentDetail = {
                        dueAmount: obj.total,
                        paidAmount: obj.total - obj._payment[payment].outstandingAmount,
                        outstandingAmount: obj._payment[payment].outstandingAmount
                    }
                    order = {
                        _id: obj._id,
                        orderDate: obj.startDate + ' To ' + obj.endDate,
                        closingDate: obj.closingDate,
                        iceCustomerId: obj.iceCustomerId,
                        customerName: obj._customer.name + ' (' + obj._customer.customerType+'ថ្ងៃ)',
                        customerType: obj._customer.customerType,
                        _payment: paymentDetail
                    }
                }
            }else{
                order = {
                    _id: obj._id,
                    orderDate: obj.startDate + ' To ' + obj.endDate,
                    closingDate: obj.closingDate,
                    iceCustomerId: obj.iceCustomerId,
                    customerName: obj._customer.name + ' (' + obj._customer.customerType+'ថ្ងៃ)',
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
            var sortContent = content.sort(compare)
            data.content = sortContent;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});

var formatKh = function(value){
    return numeral(value).format('0,0');
}