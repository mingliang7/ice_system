// /**
//  * List
//  */
// Ice.ListForReportState = new ReactiveObj();

// Ice.ListForReport = {
//     patient: function () {
//         var list = [];
//         list.push({label: "(Select One)", value: ""});

//         var currentBranch = Session.get('currentBranch');
//         Ice.Collection.Patient.find({branchId: currentBranch})
//             .forEach(function (obj) {
//                 list.push({label: obj._id + " : " + obj.name + ' (' + obj.gender + ')', value: obj._id});
//             });

//         return list;
//     },
//     registerForPatient: function () {
//         var list = [];
//         list.push({label: "Select One", value: ""});

//         var patientId = Ice.ListForReportState.get('patientId');
//         Ice.Collection.Register.find({
//             patientId: patientId
//         }).forEach(function (obj) {
//             var label = obj._id + ' | Date: ' + obj.registerDate + ' | Total: ' + numeral(obj.total).format('0,0.00');
//             list.push({label: label, value: obj._id});
//         });

//         return list;
//     }
// };
