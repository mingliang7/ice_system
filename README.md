# Meteor Cpanel 
Meteor Cpanel for Rabbit Training Center.

## Usage
- Copy the sample module and rename `rabbit`

```js
// Structure
|_rabbit
    |_both  // run at server and client
        |_collections   // for collection and schema
            |_reports
                |_myReport.js
            myCollection.js
        |_collectionsHelper
        |_lib   // other file or libraries load first
            |_config    // configuration file
                module.js
                namespace.js
            list.js     // list view for select box
            listForReport.js    // list view for select box of report form
        |_routers
            |_reports
                myReport.js
            home.js
            myRouter.js
        |_tabulars
            myTabular.js
    |_client
        |_app   // other file or libraries load first on client
            |_config
            |_helpers
            |_methods
            |_startup
            |_subscriptions
                mySub.js
        |_compatibility     // other external js libraries
        |_css
        |_templates
            |_layout    // menu bar
                navbar.html
            |_myTemplate
                myTemplate.html
                myTemplate.js
            |_reports
                myReport.html
                myReprot.js
    |_server
        |_app   // other file or libraries load first on server
            security.js     // create security method like config in Module
        |-collectionsHook   // create hook to tract events
        |_methods
        |_publications
            myPub.js
        |_security
            mySec.js
        |_startup
            startup.js
```

- Config new module and set roles in `rabbit/both/lib/config/module.js`

```js
// Module
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.Rabbit = {
    name: 'Rabbit Project',
    version: '0.0.1',
    summary: 'Rabbit Management System is ...',
    roles: [
        'admin',
        'general',
        'reporter'
    ]
};
```

- Config namespace in `rabbit/both/lib/config/namespace.js` to use collection, schema, tabular and other libraries

```js
// Namespace
Rabbit = {};

Meteor.isClient && Template.registerHelper('Rabbit', Rabbit);

/* Collection */
Rabbit.Collection = {};

/* Schema */
Rabbit.Schema = {};

/* Tabular */
Rabbit.TabularTable = {};
```

- Create security method in `rabbit/server/app/security.js`

```js
// Admin
Security.defineMethod("rabbit_ifAdmin", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['admin'], 'Rabbit');
    }
});

// General
Security.defineMethod("rabbit_ifGeneral", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['general'], 'Rabbit');
    }
});

// Reporter
Security.defineMethod("rabbit_ifReporter", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['reporter'], 'Rabbit');
    }
});
```

- Create home page (router, template)
- Config menu bar in `rabbit/client/templates/layout/navbar.html`

```js
<template name="rabbit_navbar">
    <ul class="nav navbar-nav">
        <li class="{{isActiveRoute name='rabbit.home'}}">
            <a href="{{pathFor 'rabbit.home'}}">Home</a>
        </li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                Data <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
                <li class="{{isActiveRoute name='rabbit.customer'}}">
                    <a href="{{pathFor 'rabbit.customer'}}">Customer</a>
                </li>
                <li class="{{isActiveRoute name='rabbit.order'}}">
                    <a href="{{pathFor 'rabbit.order'}}">Order</a>
                </li>
            </ul>
        </li>
    </ul>
    ...
</template>
```

- Create list view of select options in `rabbit/both/lib/methods/list.js`

```js
// List
Rabbit.List = {
    gender: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        list.push({label: 'Male', value: 'M'});
        list.push({label: 'Female', value: 'F'});

        return list;
    },
    address: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Rabbit.Collection.Address.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
            });

        return list;
    }
};

// List for report
Rabbit.ListForReport = {
    type: function () {
        var list = [];
        list.push({label: "(Select All)", value: ""});

        list.push({label: 'A', value: 'A'});
        list.push({label: 'B', value: 'B'});

        return list;
    }
};
```

- Create any methods (server, client or both)
- Create `Test CRUD`: collection, security in `rabbit/server/security/security.js`, publish/sub, tabular, router, template...

## Internal libraries
- DateTimePicker in `rabbit/client/app/methods`

```js
Template.templateName.onRendered(function(){
    var name = $('[name="date"]');
    DateTimePicker.date(name);

    // .date(), .dateTime(), .time(), .date2(), .dateRange(), .dateTimeRange()
})
```

- Render Template in `rabbit/client/app/methods`

```js
// Use with bootbox
var data = {name: value, gender: value};
bootbox.dialog({
            message: renderTemplate(Template.rabbit_testShow, data),
            title: "Title"
        });
```

- Modal Template in `rabbit/client/app/methods`

```js
// Template
<template name="sample_testInsert">

    <div class="modal fade" data-backdrop="static" id="sample_testInsertModal">
        <div class="modal-dialog  modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Test Insert</h4>
                </div>

                {{#autoForm collection=Sample.Collection.Test id="sample_testInsert" type="insert"}}
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                {{> afQuickField name='name'}}
                                {{> afQuickField name='gender' options=Sample.List.gender}}
                                {{> afQuickField name='address'}}
                            </div>
                            <div class="col-md-6">
                                {{> afQuickField name='telephone'}}
                                {{> afQuickField name='email'}}
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="reset" class="btn btn-default">Reset</button>
                    </div>
                {{/autoForm}}

            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->

</template>

// Js
'click .insert': function (e, t) {
   var data = {name: value, gender: value};
   ModalTemplate.show('sample_testInsert', data);
},
```

- Modal Max Height in `rabbit/client/app/methods`

```js
// Use with bootbox
'click .show': function (e, t) {
    bootbox.dialog({
        message: renderTemplate(Template.sample_testShow, this),
        title: "Test Info"
    });
    modalMaxHeight();
}
```

- Alertify in `rabbit/client/app/methods`

```js
// How to use custom
createNewAlertify("customer"); // Call in template create

alertify.customer("<i class='fa fa-plus'></i> Customer", renderTemplate(Template.sample_customerInsert))
    .maximize(); // auto full screen

// How to create multiple 
createNewAlertify(["customer", "addressAddon"]);// Call in template create/render

// How to close
alertify.customer().close();

// How to get data
var $customers = $(alertify.customer().elements.content);
alert($customers.find("#name"));
```

- Get current datetime from server

```js
// Default call
Meteor.call('currentDate', function (error, result) {
    // result 'YYYY-MM-DD H:mm:ss'
    ...
});

// Reactive call
var currentDate = ReactiveMethod.call("currentDate"); // 'YYYY-MM-DD H:mm:ss'
```

## Subscriptions
- Subscriptions of cpanel is declared at global. 

## Namespace
- Router: `rabbit.routerName` (name), `rabbit/routerName` (url)
- Router for report: rabbit.routerName`Report` (name), rabbit/routerName`Report` and rabbit/routerName`ReportGen` (url)
- Tabular: `rabbit_customerList`
- Template: `rabbit_templateName`
- Template for report: rabbit_templateName`Report`, rabbit_templateName`ReportGen`
- Method: `rabbit_methodName`
- Publish/Sub: `rabbit_pubName`
- Security method: `rabbit_ifSecurityName`
    
## Note
- Session: `currentModule` and `currentBranch`
- Collections:
    - Cpanel.Collection.Setting()
    - Cpanel.Collection.Company()
    - Cpanel.Collection.Branch()
    - Cpanel.Collection.Currency()
    - Cpanel.Collection.User()
    - Cpanel.Collection.Exchange()
    - Files() Collection for manage file upload like images, pdf ...
