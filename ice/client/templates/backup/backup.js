function getBackupType(type) {
    var settingType = [
        'Cpanel.Collection.Currency',
        'Cpanel.Collection.Branch',
        'Cpanel.Collection.Company',
        'Cpanel.Collection.Setting',
        'Cpanel.Collection.Currency',
        'Meteor.users',
        'Events',
        'Meteor.roles',
        //files

    ];
    var defaultType = [
        'Ice.Collection.Staffs',
        'Ice.Collection.Customer',
        'Ice.Collection.Order',
        'Ice.Collection.OrderGroup',
        'Ice.Collection.Payment',
        'Ice.Collection.RemoveInvoiceLog',
        'Ice.Collection.UserStaffs'
        //Ice.Collection.
    ];

    if (type == 'Setting') {
        return settingType;
    } else if (type == 'Default') {
        return defaultType;
    } else {
        return settingType.concat(defaultType);
    }
}
AutoForm.hooks({
    ice_backup: {
        onSubmit: function (doc) {
            var backupType = doc.backupType;
            var collections = getBackupType(backupType);
            var module = Session.get('currentModule');
            backup(module,"branchId",backupType,collections,doc.branch);
           /* var module = Session.get('currentModule');
            Meteor.call('exportDataByBranchId', collections, 'branchId', branch, function (error, response) {
                if (error) {
                    console.log(error.message);
                } else {
                    var base64ToBlob, blob;
                    base64ToBlob = function (base64String) {
                        var byteArray, byteCharacters, byteNumbers, i;
                        byteCharacters = atob(base64String);
                        byteNumbers = new Array(byteCharacters.length);
                        i = 0;
                        while (i < byteCharacters.length) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                            i++;
                        }
                        byteArray = new Uint8Array(byteNumbers);
                        return new Blob([byteArray], {
                            type: "zip"
                        });
                    };
                    blob = base64ToBlob(response);
                    var todayDate = moment(TimeSync.serverTime(null)).format('YYYYMMDDHHmmss');
                    var fileName = module + '-' + backupType + '-' + branch + '-' + todayDate + '.zip';
                    saveAs(blob, fileName);
                }
            });*/
            return false;
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
