/**
 * List
 */
Ice.ListForReportState = new ReactiveObj();

Ice.ListForReport = {
   customer: function(selectOne){
   	var list = [];
   	var type = '';
   	var customers = Ice.Collection.Customer.find();
   	if(!_.isEqual(selectOne, false)){
   		list.push({label: "(Select One)", value: ""});
   	}
   	customers.forEach(function (customer) {
   		type = customer.customerType == 'general' ? 'General' : customer.customerType + ' days'; 
   		list.push({label: '' + customer._id + ' | ' + customer.name + '(' + type + ')',
   		value: customer._id})
   	});
   	return list;
   },
   invoice: function(selectOne){
   	var list = [];
   	if(!_.isEqual(selectOne, false)){
   		list.push({label: "(Select One)", value: ""});
   	}
   	return list;
   }
}
