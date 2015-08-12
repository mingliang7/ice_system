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
   generalCustomer: function(selectOne){
      var list = [];
      var customers = Ice.Collection.Customer.find({customerType: 'general', status: 'enable'});
      if(!_.isEqual(selectOne, false)){
         list.push({label: "(Select One)", value: ""});
      }
      customers.forEach(function(customer) {
         list.push({label: '' + customer._id + ' | ' + customer.name + '(' + customer.customerType + ')',
         value: customer._id})
      });
      return list;
   },
   customerType: function(all){ 
      list = []
      invoiceGroup = Ice.ListForReportState.get('invoiceGroup');
      if(!_.isEqual(all, false)){
         list.push({label: "All", value: ""})
      }

      list.push({label: 'General', value: 'general'})
      list.push({label: '5 days', value: '5'})
      list.push({label: '10 days', value: '10'})
      list.push({label : '15 days', value: '15'})
      list.push({label: '20 days', value: '20'})
      list.push({label: '30 days', value: '30'})
      return list;
   },
   groupCustomerType: function(all){ // for customer that is grouped by 5,10,15,20 days
       list = []
      invoiceGroup = Ice.ListForReportState.get('invoiceGroup');
      if(!_.isEqual(all, false)){
         list.push({label: "All", value: ""})
      }
      list.push({label: '5 days', value: '5'})
      list.push({label: '10 days', value: '10'})
      list.push({label : '15 days', value: '15'})
      list.push({label: '20 days', value: '20'})
      list.push({label: '30 days', value: '30'})
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
               debugger
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
   },
   staff: function(selectAll){
      var list = [];
      var staffs = Ice.Collection.Staffs.find()
      if(!_.isEqual(selectAll, false)){
         list.push({label: "All", value: ""});
      }
      staffs.forEach(function (staff) {
         list.push({label: staff.name, value: staff._id})
      });
      return list;
   },
   customerByType: function(all){
      var list = [];
      var customerType = Ice.ListForReportState.get('customerType');
      customerType = customerType == undefined ? '' : customerType;
      customers = findCustomerByType(customerType); 
      if(!_.isEqual(all, false)){
         list.push({label: "All", value: ""});
      }
      if(customerType != ''){
        list = customers;
      }

      return list;
   },
   status: function(all){
      var list = [];
      if(!_.isEqual(all, false)){
         list.push({label: "All", value: ""});
      }
      list.push({label: 'Unpaid', value: 'unPaid'});
      list.push({label: 'Closed', value: 'closed'});

      return list;
   },
   user: function(all){
      var list = [];
      if(!_.isEqual(all, false)){
         list.push({label: "All", value: ""});
      }
      var users = Meteor.users.find();
      users.forEach(function(user) {
         list.push({label: user.username, value: user._id})
      });
      return list;
   }
}

var findCustomerByType = function(type){
   arr = [] 
   customers = undefined;
   if(type != ''){
      customers = Ice.Collection.Customer.find({customerType: type})
   }else{
      customers = Ice.Collection.Customer.find()
   }
   arr.push({label: 'All', value:''});
   customers.forEach(function (customer) {
      arr.push({label: '' + customer._id + ' | ' + customer.name, value: customer._id});
   });
   return arr;
}