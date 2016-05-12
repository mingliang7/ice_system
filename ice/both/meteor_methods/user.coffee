Meteor.methods
  getCurrentUserRole: (id) ->
    flag = false
    roles = Meteor.users.findOne(id).roles.Ice
    i = 0
    while i < roles.length
      if roles[i] is 'admin'
        flag = true
      i++
    flag
