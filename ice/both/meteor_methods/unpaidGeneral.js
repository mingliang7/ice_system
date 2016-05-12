Meteor.methods({
	unpaidGeneral: function(params) {
		this.unblock();
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
		var index = 1;
		var order = {};
		var selector = {}
		if (staff == '') {
			selector = {
				orderDate: {
					$lt: today
				},
				$or: [{
					closingDate: {
						$gt: yesterday
					}
				}, {
					closingDate: 'none'
				}]
			}
		} else {
			selector = {
				iceStaffId: staff,
				orderDate: {
					$lt: today
				},
				$or: [{
					closingDate: {
						$gt: yesterday
					}
				}, {
					closingDate: 'none'
				}]
			}
		}
		var getOrder = Ice.Collection.Order.find(selector).fetch();
		getOrder.forEach(function(obj) {
			if (obj._payment != undefined) {
				currentPayment = obj._payment;
				var payment = _.findLastKey(currentPayment, function(payment) {
					if (payment.date < today) {
						return payment;
					}
				});
				if (payment != undefined) {
					var payment = {
						dueAmount: obj.total,
						paidAmount: obj.total - obj._payment[payment].outstandingAmount,
						outstandingAmount: obj._payment[payment].outstandingAmount
					}
					order[obj._id] = {
						_id: obj._id,
						orderDate: obj.orderDate,
						closingDate: obj.closingDate,
						iceCustomerId: obj.iceCustomerId,
						customerName: obj._customer.name + ' (' + obj._customer.customerType +
							')',
						staffName: obj._staff.name,
						_payment: payment
					}
				}
			} else {
				order[obj._id] = {
					_id: obj._id,
					orderDate: obj.orderDate,
					closingDate: obj.closingDate,
					iceCustomerId: obj.iceCustomerId,
					customerName: obj._customer.name + ' (' + obj._customer.customerType +
						')',
					staffName: obj._staff.name,
					_payment: {
						outstandingAmount: obj.outstandingAmount,
						paidAmount: obj.paidAmount,
						dueAmount: obj.total
					}
				}

			}
		});
		for (var key in order) {
			content.push(order[key]);
		}
		if (content.length > 0) {
			var sortContent = content.sort(compare)
			data.content = sortContent;
			return data;
		} else {
			data.content.push({
				index: 'no results'
			});
			return data;
		}
	}
});

var formatKh = function(value) {
	return numeral(value).format('0,0');
}

// sort function
function compare(a, b) {
	if (a._id < b._id)
		return -1;
	if (a._id > b._id)
		return 1;
	return 0;
}
