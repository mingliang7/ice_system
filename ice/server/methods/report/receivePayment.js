Meteor.methods({
    receivePaymentReport: function(params) {
        var self = params;
        var data = {
            title: {},
            header: {},
            content: [],
            displayFields: [],
            footer: {}
        };
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company.khName,
            address: company.khAddress,
            telephone: company.telephone
        };
        customerType = self.customerType == '' ? 'All' : self.customerType;
        customer = self.customerId == '' ? 'All' : Ice.Collection.Customer.findOne(self.customerId).name;
        status = self.status == '' ? 'All' : self.status;
        staff = self.staffId == '' ? 'All' : Ice.Collection.Staffs.findOne(self.staffId).name;
        data.header = {
            date: self.date,
            customerType: customerType,
            customer: customer,
            staff: staff
        };
        var selector = {};
        if (self.customerType != '' && self.customerId == '') {
            var arr = [];
            var customers = Ice.Collection.Customer.find({customerType: self.customerType}, {_id: 1});
            customers.forEach(function (customer) {
                arr.push(customer._id);
            });
            selector.customerId = {$in: arr}
        }
        if (self.status != '') {
            selector.status = self.status == 'unPaid' ? {$in: ['partial', 'active']} : self.status;
        }
        if (self.customerId != '') {
            selector.customerId = self.customerId;
        }
        if(self.staffId != '') {
            selector.staffId = self.staffId;
        }
        date = self.date.split(' To ');
        startDate = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(date[1]).format('YYYY-MM-DD 00:00:00');
        selector.paymentDate = {
            $gte: startDate,
            $lte: endDate
        };
        var payments = Ice.Collection.ReceivePayment.aggregate([
            {
                $match: selector
            },
            {$sort: {invoiceId: 1}},
            {
                $lookup: {
                    from: "ice_customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            },
            {
                $lookup: {
                    from: "ice_staffs",
                    localField: "staffId",
                    foreignField: "_id",
                    as: "staffDoc"
                }
            },
            {$unwind: {path: '$staffDoc'}},
            {
                $unwind: {path: '$customerDoc'}
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $addToSet: "$$ROOT"
                    },
                    dueAmount: {
                        $sum: '$dueAmount'
                    },
                    paidAmount: {
                        $sum: '$paidAmount'
                    },
                    balanceAmount: {
                        $sum: '$balanceAmount'
                    }

                }
            }
        ]);
        if(payments.length > 0) {
            data.content = payments[0].data;
            data.footer = {
                dueAmount: payments[0].dueAmount,
                paidAmount: payments[0].paidAmount,
                balanceAmount: payments[0].balanceAmount
            }
        }
        console.log(data.footer);
        return data;
    }
});