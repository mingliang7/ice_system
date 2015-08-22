AutoForm.hooks({
    ice_restore: {
        onSubmit: function (doc) {
            var zipFileToLoad = $("#file-restore").prop('files')[0];
            var module = Session.get('currentModule');
            restore(zipFileToLoad,module,doc.restoreType,doc.branch);
            /*var fileName=zipFileToLoad.name;
            var fileParts=fileName.split('-');
            if(fileParts[1]==null || fileParts[1]!=doc.restoreType){
                alertify.error('RestoreType is incorrect.');
                return false;
            }
            debugger;
            if(fileParts[2]==null || (doc.restoreType=='Default' && doc.branch!=fileParts[2])){
                alertify.error('Restore branch is incorrect.');
                return false;
            }
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                try {
                    var zipFileLoaded = new JSZip(fileLoadedEvent.target.result);
                    for (var key in zipFileLoaded.files) {
                        var file = zipFileLoaded.files[key];
                        Meteor.call('restoreOneCollection', file.asText(), function (error, result) {
                            if (error) {
                                alertify.error(error.message);
                            }
                        });
                    }
                    alertify.success("Database is Restored Successfully.");
                } catch (error) {
                    alertify.error(error);
                }
            };
            fileReader.readAsArrayBuffer(zipFileToLoad);*/
            return false
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

