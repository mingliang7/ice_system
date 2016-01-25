Meteor.methods({
	retailInvoice: function (id) {
		//var getOrder = Ice.Collection.Order.findOne(id);
		var getOrder = StateId.get(id);
		var _customer, _staff;
		if (!_.isUndefined(getOrder)) {
			_customer = Ice.Collection.Customer.findOne(getOrder.iceCustomerId);
			_staff = Ice.Collection.Staffs.findOne(getOrder.iceStaffId);
			if (_.isUndefined(getOrder._payment)) {
				getOrder._payment = {
					paidAmount: getOrder.paidAmount,
					outstandingAmount: getOrder.outstandingAmount
				}
			}
		} else {
			getOrder = Ice.Collection.Order.findOne(id);
			_customer = getOrder._customer;
			_staff = getOrder._staff;
			getOrder._payment = {
				paidAmount: getOrder.paidAmount,
				outstandingAmount: getOrder.outstandingAmount
			}
		}
		var splitDate = getOrder.orderDate.split(' ');
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

		// var getGroup = Ice.Collection.OrderGroup.findOne({_id: getOrder.groupId, iceCustomerId: getOrder.customerId, startDate: {$lt: getOrder.endDate}, endDate:{$gt: getOrder.startDate}});
		// dueDate = '' + getGroup.startDate + '-' + getGroup.endDate;
		if (_customer.customerType !== 'general') {
			type = _customer.customerType + ' ថ្ងៃ';
		} else {
			type = 'general';
		}
		data.header = [{
			col1: '#: ' + id,
			col2: 'បុគ្គលិក: ' + _staff.name
		}, {
			col1: 'អតិថិជន: ' + _customer.name,
			col2: 'ប្រភេទ: ' + type
		}, {
			col1: 'កាលបរិច្ឆេទ: ' + date,
			col2: 'ម៉ោង: ' + time
		}];

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
		delete StateId._obj[id]
		console.log(StateId);
		if (content.length > 0) {
			data.content = content;
			data.footer = {
				subtotal: formatKH(getOrder.subtotal),
				discount: getOrder.discount == undefined ? '' : getOrder.discount,
				total: formatKH(getOrder.total),
				totalInDollar: formatDollar(getOrder.totalInDollar),
				paidAmount: formatKH(getOrder._payment.paidAmount),
				outstandingAmount: formatKH(getOrder._payment.outstandingAmount)
			}
			return data;
		} else {
			data.content.push({
				index: 'no results'
			});
			return data;
		}
	}
})
var formatDollar = function (value) {
	return numeral(value).format('0,0.00');
}
var formatKH = function (value) {
	return numeral(value).format('0,0');
}
