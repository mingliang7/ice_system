Meteor.methods({
	orderByCustomer: function (params) {
		this.unblock();
		var self = params;
		var data = {
			title: {},
			header: {},
			content: [],
			footer: {}
		};


		/********* Header ********/
		customerType = self.customerType == '' ? 'All' : self.customerType;
		customer = self.customerId == '' ? 'All' : self.customerId;
		var company = Cpanel.Collection.Company.findOne();
		data.title = {
			company: company.enName,
			address: company.khAddress,
			telephone: company.telephone
		};
		data.header = {
			date: self.date,
			customerType: customerType,
			customer: customer
		};
		/********** Content **********/
		var content = [];
		var selector = {};
		date = self.date.split(' To ');
		startDate = date[0];
		endDate = date[1];
		if (customerType == 'All' && customer == 'All') {
			selector = {
				orderDate: {
					$gte: startDate,
					$lte: endDate
				}
			}
			var order = Ice.Collection.Order.find(selector);
			var index = 1;
			var reduceCustomer = groupCustomer(order);
			var td = listCustomerAsTable(reduceCustomer);
			content.push({
				list: td
			});
		} else if (customerType != 'All' && customer == 'All') {
			var orderArr = [];
			selector = {
				orderDate: {
					$gte: startDate,
					$lte: endDate
				}
			}
			selector['_customer.customerType'] = customerType
			var orders = Ice.Collection.Order.find(selector);
			orders.forEach(function (order) {
				orderArr.push(order);
			});
			var reduceCustomer = groupCustomer(orderArr);
			var td = listCustomerAsTable(reduceCustomer);
			content.push({
				list: td
			});
		} else {
			selector = {
				iceCustomerId: customer,
				orderDate: {
					$gte: startDate,
					$lte: endDate
				}
			};
			var order = Ice.Collection.Order.find(selector)
			var index = 1;
			var reduceCustomer = groupCustomer(order);
			var td = listCustomerAsTable(reduceCustomer);
			content.push({
				list: td
			});
		}
		if (content.length > 0) {
			data.content = content;
			return data;
		} else {
			data.content.push({
				index: 'no results'
			});
			return data;
		}
	}
});


// methods
findStaff = function (id) {
	return Ice.Collection.Staffs.findOne(id).name;
}

sortItems = function (orderDetail) {
	td = ""
	listItem = {};
	items = Ice.Collection.Item.find()
	count = 0;
	items.forEach(function (item) {
		listItem[item._id] = item;
		listItem[item._id].qty = 0;
		listItem[item._id].amount = 0;
		listItem[item._id].discount = 0;

	});
	orderDetail.forEach(function (order) {
		listItem[order.iceItemId] = {
			qty: listItem[order.iceItemId].qty += order.qty,
			price: order.price,
			amount: listItem[order.iceItemId].amount += order.amount
		}
	});
	// display all items
	for (var k in listItem) {
		td += '<td>' + formatQty(listItem[k].qty) + '</td>' + '<td>' + formatKh(
				listItem[k].price) + '</td>' + '<td>' + formatKh(listItem[k].amount) +
			'</td>'
	}
	return td;
}

formatKh = function (val) {
	return numeral(val).format('0,0')
}
formatUS = function (val) {
	return numeral(val).format('0,0.00');
}
var formatEx = function (id) {
	exchange = Cpanel.Collection.Exchange.findOne(id)
	return JSON.stringify(exchange.rates);
}

var formatQty = function (val) {
	return numeral(val).format('0.0');
}
var findCustomerByType = function (type) {
	arr = []
	customers = undefined;
	if (type != 'All') {
		customers = Ice.Collection.Customer.find({
			customerType: type
		})
	} else {
		customers = Ice.Collection.Customer.find()
	}
	customers.forEach(function (customer) {
		arr.push(customer._id);
	});
	return arr;
}

var findCustomerName = function (id) {
		return Ice.Collection.Customer.findOne(id).name;
	}
	// group all order group invoices by customer
var orderGroupCustomer = function (total, id, startDate, endDate) {
	var startDate = startDate.split(' ');
	var endDate = endDate.split(' ');
	var outstandingAmount = 0;
	var paidAmount = 0;
	var discount = 0;
	var groupOrders = Ice.Collection.OrderGroup.find({
		iceCustomerId: id,
		startDate: {
			$gte: startDate[0]
		},
		endDate: {
			$lte: endDate[0]
		}
	})
	groupOrders.forEach(function (order) {
		paidAmount += order.paidAmount
		outstandingAmount = total - paidAmount
		discount += order.discount;
	});
	return {
		discount: discount,
		paidAmount: paidAmount,
		outstandingAmount: outstandingAmount
	};
}



// grouping all customer

var groupCustomer = function (order) {
	var orders = order;
	var customer = customerItem(orders);
	var gItems = getItems();
	var customerObj = {};
	orders.forEach(function (order) {
		var id = order.iceCustomerId;
		customerObj[id] == undefined ? customerObj[id] = {} : customerObj[id];
		if (order.paidAmount != undefined) {
			if (customerObj[id].paidAmount == undefined && customerObj[id].outstandingAmount ==
				undefined) {
				customerObj[id]['outstandingAmount'] = order.outstandingAmount;
				customerObj[id]['paidAmount'] = order.paidAmount;
				customerObj[id]['discount'] = order.discount == undefined ? 0 : order.discount;
			} else {
				customerObj[id]['outstandingAmount'] = customerObj[id][
					'outstandingAmount'
				] += order.outstandingAmount;
				customerObj[id]['paidAmount'] = customerObj[id]['paidAmount'] += order.paidAmount;
				if (order.discount == undefined) {
					customerObj[id]['discount'] = customerObj[id]['discount'] == undefined ?
						0 : customerObj[id]['discount'] += 0
				} else {
					customerObj[id]['discount'] = customerObj[id]['discount'] += order.discount
				}
			}
		}
		order.iceOrderDetail.forEach(function (item) {
			customerObj[id]['total'] == undefined ? customerObj[id]['total'] = item
				.amount : customerObj[id]['total'] = customerObj[id]['total'] += item.amount;
			if (customerObj[id][item.iceItemId] == undefined) {
				customerObj[id][item.iceItemId] = {};
				customerObj[id][item.iceItemId] = {
					code: customer[id][item.iceItemId].code,
					name: customer[id][item.iceItemId].name,
					price: item.price,
					qty: item.qty,
					amount: item.amount
				}
			} else {
				customerObj[id][item.iceItemId] = {
					code: customer[id][item.iceItemId].code,
					name: customer[id][item.iceItemId].name,
					price: item.price,
					qty: customerObj[id][item.iceItemId].qty += item.qty,
					amount: customerObj[id][item.iceItemId].amount += item.amount
				}
			}

		});
	});
	// show all item
	// for(var k in gItems) {
	//    for(var j in customerObj){
	//         if(customerObj[j][k] == undefined){
	//             customerObj[j][k] = {
	//                 code: gItems[k].code,
	//                 name:  gItems[k].name,
	//                 price: gItems[k].price,
	//                 qty: 0,
	//                 amount:0
	//             }
	//         }
	//    }
	// }
	return customerObj;
}


var customerItem = function (customerObj) {
	var iceItemObj = {};
	var customers = {};
	var items = Ice.Collection.Item.find()
	items.forEach(function (item) {
		iceItemObj[item._id] = {
			code: item.code,
			name: item.name,
			price: item.price,
			unit: item.unit,
			qty: 0,
			amount: 0

		}
	});
	customerObj.forEach(function (customer) {
		customers[customer.iceCustomerId] = iceItemObj;
	});
	return customers;
}

var getItems = function () {
	var iceItemObj = {};
	var items = Ice.Collection.Item.find()
	items.forEach(function (item) {
		iceItemObj[item._id] = {
			code: item.code,
			name: item.name,
			price: item.price,
			unit: item.unit,
			qty: 0,
			amount: 0

		}
	});
	return iceItemObj;
}

listCustomerAsTable = function (reduceCustomer) {
	td = ''
	for (var k in reduceCustomer) {
		td += '<tr><th colspan="4" align="center"><u>' + k + ' | ' +
			findCustomerName(k) + '</u></tr></th>'
		td += '<tr style="border: 1px solid #ddd;">' +
			'<th style="border: 1px solid #ddd;">' + 'ទំនិញ' + '</th>' +
			'<th style="border: 1px solid #ddd;">' + 'ចំនួន' + '</th>' +
			'<th style="border: 1px solid #ddd;">' + 'តម្លៃលក់' + '</th>' +
			'<th style="border: 1px solid #ddd;">' + 'តម្លៃសរុប' + '</th>' + '</tr>'
		for (var j in reduceCustomer[k]) {
			if (reduceCustomer[k][j].name != undefined) {
				td += '<tr style="border: 1px solid #ddd;">' +
					'<td style="border: 1px solid #ddd;">' + reduceCustomer[k][j].name +
					'</td>' + '<td style="border: 1px solid #ddd;">' + reduceCustomer[k][j].qty +
					'</td>' + '<td style="border: 1px solid #ddd;">' + formatKh(
						reduceCustomer[k][j].price) + '</td>' +
					'<td style="border: 1px solid #ddd;">' + formatKh(reduceCustomer[k][j].amount) +
					'</td>' + '</tr>';
			}
		}
		if (reduceCustomer[k].paidAmount != undefined) {
			td += '<tr>' + '<td><strong>ទឹកប្រាក់សរុប: ' +
				formatKh(reduceCustomer[k].total) + '</strong></td>' +
				'<td><strong> បញ្ចុះតម្លៃ: ' +
				formatKh(reduceCustomer[k].discount) +
				'</strong></td>' +
				'<td><strong> ទឹកប្រាក់បានទទួល: ' +
				formatKh(reduceCustomer[k].paidAmount) +
				'</strong></td>' + '<td><strong>ទឹកប្រាក់ជំពាក់: ' +
				formatKh(reduceCustomer[k].outstandingAmount) +
				'</strong></td>' + '</tr>';
		} else {
			var group = orderGroupCustomer(reduceCustomer[k].total, k, startDate,
				endDate);
			td += '<tr style="border: 1px solid #ddd;">' +
				'<td ><strong>ទឹកប្រាក់សរុប: ' +
				formatKh(reduceCustomer[k].total) +
				'<td ><strong> បញ្ចុះតម្លៃ: ' +
				formatKh(group.discount) +
				'</strong></td>' +
				'</strong></td>' + '<td><strong> ទឹកប្រាក់បានទទួល: ' +
				formatKh(group.paidAmount) + '</strong></td>' +
				'<td colspan="1"><strong>ទឹកប្រាក់ជំពាក់: ' +
				formatKh(group.outstandingAmount) + '</strong></td>' + '</tr>';
		}
	}
	td += listTotalSummary(reduceCustomer);
	return td;
}


var listTotalSummary = function (reduceCustomer) {
	var td = '';
	var totalItem = {};
	var outstandingAmount = 0;
	var paidAmount = 0;
	var total = 0;
	var discount = 0;
	var listTotalItem = '';
	for (var k in reduceCustomer) {
		for (var j in reduceCustomer[k]) {
			if (reduceCustomer[k][j].name) {
				if (totalItem[j]) {
					totalItem[j].qty += reduceCustomer[k][j].qty;
					totalItem[j].amount += reduceCustomer[k][j].amount;
				} else {
					totalItem[j] = {
						name: reduceCustomer[k][j].name,
						qty: reduceCustomer[k][j].qty,
						price: reduceCustomer[k][j].price,
						amount: reduceCustomer[k][j].amount
					}
				}
			}
		}
		total += reduceCustomer[k].total;
		if (reduceCustomer[k].paidAmount != undefined) {
			paidAmount += reduceCustomer[k].paidAmount;
			outstandingAmount += reduceCustomer[k].outstandingAmount;
			discount += reduceCustomer[k].discount == undefined ? 0 : reduceCustomer[k]
				.discount
		} else {
			var group = orderGroupCustomer(reduceCustomer[k].total, k, startDate,
				endDate);
			paidAmount += group.paidAmount
			outstandingAmount += group.outstandingAmount
			discount += group.discount
		}
	}
	td += '<tr><th colspan="4" align="center"><u>' + 'សរុបទាំងអស់' +
		'</u></tr></th>';
	td += '<tr style="border: 1px solid #ddd;">' +
		'<th style="border: 1px solid #ddd;">' + 'ទំនិញ' + '</th>' +
		'<th style="border: 1px solid #ddd;">' + 'ចំនួន' + '</th>' +
		'<th style="border: 1px solid #ddd;">' + 'តម្លៃលក់' + '</th>' +
		'<th style="border: 1px solid #ddd;">' + 'តម្លៃសរុប' + '</th>' + '</tr>'
	for (var k in totalItem) {
		if (totalItem[k].name != undefined) {
			td += '<tr style="border: 1px solid #ddd;">' +
				'<td style="border: 1px solid #ddd;">' +
				totalItem[k].name + '</td>' +
				'<td style="border: 1px solid #ddd;">' +
				totalItem[k].qty + '</td>' +
				'<td style="border: 1px solid #ddd;">' +
				'' +
				'</td>' + '<td style="border: 1px solid #ddd;">' +
				formatKh(totalItem[k].amount) + '</td>' + '</tr>';
		}
	}
	td += '<tr style="border: 1px solid #ddd;">' +
		'<td><strong>ទឹកប្រាក់សរុប: ' +
		formatKh(total) +
		'<td><strong>បញ្ចុះតម្លៃ: ' +
		formatKh(discount) +
		'</strong></td>' +
		'</strong></td>' + '<td><strong> ទឹកប្រាក់បានទទួល: ' +
		formatKh(paidAmount) + '</strong></td>' +
		'<td><strong>ទឹកប្រាក់ជំពាក់: ' +
		formatKh(outstandingAmount) + '</strong></td>' + '</tr>';
	return td
}
