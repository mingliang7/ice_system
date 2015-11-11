###*
# Admin
###

Security.defineMethod 'iceContainer_ifAdmin',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'admin' ], 'IceContainer')

###*
# General
###

Security.defineMethod 'iceContainer_ifGeneral',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'general' ], 'IceContainer')

###*
# Reporter
###

Security.defineMethod 'iceContainer_ifReporter',
  fetch: []
  transform: null
  deny: (type, arg, userId) ->
    !Roles.userIsInRole(userId, [ 'reporter' ], 'IceContainer')

