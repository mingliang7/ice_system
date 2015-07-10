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
   	var customerId = Ice.ListForReportState.get('customer');
      var update = Session.get('checkIfUpdate');
      if(!_.isEqual(selectOne, false)){
         list.push({label: "(Select One)", value: ""});
      }
      if(customerId != ''){
         var type = Ice.Collection.Customer.findOne(customerId).customerType; 
         if(update == true){
            if(type == 'general'){
               Ice.Collection.Order.find({iceCustomerId: customerId}).forEach(function (invoice) {
               list.push({label: '' + invoice._id + ' | '+ invoice.orderDate  , value: invoice._id})
               });
               Ice.ListForReportState.set('type', type);
            }else{
               Ice.Collection.OrderGroup.find({iceCustomerId: customerId}).forEach(function (invoice) {
               list.push({label: '' + invoice._id + ' | ' + invoice.startDate + ' To ' + invoice.endDate , value: invoice._id})
               });
               Ice.ListForReportState.set('type', type);
            }
         }else{
            if(type == 'general'){
               Ice.Collection.Order.find({iceCustomerId: customerId, closing: false}).forEach(function (invoice) {
               list.push({label: '' + invoice._id + ' | '+ invoice.orderDate  , value: invoice._id})
               });
               Ice.ListForReportState.set('type', type);
            }else{
               Ice.Collection.OrderGroup.find({iceCustomerId: customerId, closing: false}).forEach(function (invoice) {
               list.push({label: '' + invoice._id + ' | ' + invoice.startDate + ' To ' + invoice.endDate , value: invoice._id})
               });
               Ice.ListForReportState.set('type', type);
            }
       }
      }
      return list;
   }
}
