
Ice.Schema.Backup = new SimpleSchema({
    branch:{
        type:String,
        label:"Branch",
        autoform: {
            type: "select2",
            options:function(){
                return Ice.List.branchForUser();
            }
        },
        optional:true
    },

    backupType:{
        type:String,
        label:"Backup Type",
        autoform: {
            type: "select2",
            options:function() {
                return Ice.List.backupAndRestoreTypes();
            }
        }
    }
});