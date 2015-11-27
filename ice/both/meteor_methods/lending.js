Meteor.methods({
  checkReturn: function (id) {
    var flag, returnDate;
    returnDate = Ice.Collection.Lending.findOne({
      _id: id,
      'containers.returnDate': {
        $exists: true
      }
    })
    flag = _.isUndefined(returnDate) ? false : true;
    return flag;
  }
});
