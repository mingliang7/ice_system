###*
# Admin
###

Security.defineMethod 'ice_ifAdmin',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'admin' ], 'Ice')

###*
# General
###

Security.defineMethod 'ice_ifGeneral',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'general' ], 'Ice')

###*
# Reporter
###

Security.defineMethod 'ice_ifReporter',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'reporter' ], 'Ice')

