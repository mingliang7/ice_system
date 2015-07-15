Ice.Collection.Staffs.before.insert(function(userId, doc) {
	doc.createdAt = new Date()
});
