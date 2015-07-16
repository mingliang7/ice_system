/**
 * Helper
 */
Template.headerLayout.helpers({
    navbar: function () {
        var module = Session.get('currentModule');
        var branch = Session.get('currentBranch');
        if (!Meteor.userId() || _.isUndefined(module) || _.isUndefined(branch)) {
            return {show: false};
        }

        return {show: true, template: s.decapitalize(module) + '_navbar'};
    },
    currentBranch: function () {
        var module = Session.get('currentModule');
        var branch = Session.get('currentBranch');
        if (_.isUndefined(module) || _.isUndefined(branch)) {
            return {show: false};
        }

        var getBranch = Cpanel.Collection.Branch.findOne({_id: branch});
        var title = branch + ' : ' + getBranch.enShortName;
        return {show: true, title: title};
    }
});
