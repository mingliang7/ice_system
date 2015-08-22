Ice.Collection.EndOfProcess = new Mongo.Collection('ice_endOfProcess')

Ice.Schema.EndOfProcess = new SimpleSchema(
	date:
		label: 'Date' 
		type: String
	userId:
		type: String 
		autoValue: ->
			if @isInsert
				Meteor.userId()
)

Ice.Collection.EndOfProcess.attachSchema Ice.Schema.EndOfProcess