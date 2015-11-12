Meteor.methods({
  getContainer: function () {
    var list = [{
      label: '(select one)',
      value: ''
    }];
    var containers = IceContainer.Collection.Container.find({
      status: 'Available'
    }).fetch();
    if (containers.length > 0) {
      containers.forEach(function (container) {
        list.push({
          label: container._id + ' | ' + container.code,
          value: container._id
        });
      });
    }
    return list;
  }
});
