Package.describe({
    name: 'theara:breadcrumb',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'Breadcrumb for iron router',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');

    api.use(
        [
            'blaze',
            'templating',
            'ui'
        ]
    );
    api.use('iron:router@1.0.9', 'client');

    api.addFiles('breadcrumb.js');
    api.addFiles('breadcrumb.html');

    api.export('Breadcrumb');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('theara:breadcrumb');
    api.addFiles('breadcrumb-tests.js');
});
