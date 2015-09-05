/**
 * Welcome
 */
// Server clock
// Template.cpanel_welcome.onRendered(function () {
//     Meteor.setInterval(serverClock, 1000);
// });

Template.cpanel_welcome.helpers({
    role: function () {
        var role = Roles.getGroupsForUser(Meteor.userId());
        if (role.length > 0) {
            return true;
        }

        return false;
    }
});

Template.cpanel_welcomeConfig.helpers({
    value: function () {
        var data = {
            module: Session.get('currentModule'),
            branch: Session.get('currentBranch')
        };
        return data;
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    cpanel_welcomeConfig: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            this.event.preventDefault();

            // Set current session
            Session.setAuth('currentModule', insertDoc.module);
            Session.setAuth('currentBranch', insertDoc.branch);

            Router.go(s.decapitalize(insertDoc.module) + '.home');
            this.done();
        }
    }
});

/* Clock function */
function serverClock() {
    Meteor.call('currentDate', function (error, result) {
        var dateTime = moment(result, 'YYYY-MM-DD H:mm:ss');
        var cssClass = 'bg-info';
        if (dateTime.day == 0 || dateTime.day() == 6) {
            cssClass = 'bg-warning';
        }

        $('#clock').html(dateTime.format('dddd D, MMMM YYYY H:mm:ss'));
        $('#clock').attr('class', cssClass);
    });
}
