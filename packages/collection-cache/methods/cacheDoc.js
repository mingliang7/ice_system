Mongo.Collection.prototype.cacheDoc = function (fieldName, collection, collectionFields, options) {
    check(fieldName, String);
    check(collection, Mongo.Collection);
    check(collectionFields, [String]);

    if (!Match.test(options, Object)) {
        options = {};
    }

    if (Match.test(fieldName, String)) {
        _.defaults(options, {
            cacheField: '_' + fieldName,
            refField: fieldName + 'Id'
        });
    }

    var cacheField = options.cacheField;
    var refField = options.refField;
    var thisCollection = this;
    var refCollection = collection;
    var fieldsToCopy = collectionFields;

    //Fields specifier for Mongo.Collection.find
    var fieldsInFind = {_id: 0};
    _.each(fieldsToCopy, function (field) {
        fieldsInFind[field] = 1;
    });

    /********** Before Insert This Collection **********/
    thisCollection.before.insert(function (userId, doc) {
        // Get reference doc
        var getRefDoc,
            selector = {
                _id: doc[refField]
            };
        getRefDoc = refCollection.findOne(selector, {fields: fieldsInFind});

        doc[cacheField] = getRefDoc;

        //console.log('Doc->' + thisCollection._name + '.before.insert()');
    });


    /********** Before Update This Collection **********/
    thisCollection.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};

        // Get new reference doc
        var getRefDoc,
            selector = {
                _id: modifier.$set[refField]
            };

        // Check soft remove is true
        if (!_.isUndefined(modifier.$set.removed) || !_.isUndefined(modifier.$set.restoredAt) || _.isUndefined(modifier.$set[refField])) {
            selector._id = doc[refField];
        }

        getRefDoc = refCollection.findOne(selector, {fields: fieldsInFind});
        console.log(getRefDoc)
        modifier.$set[cacheField] = getRefDoc;

        //console.log('Doc->' + thisCollection._name + '.before.update()');
    });

    /********** After Update This Collection **********/
    thisCollection.after.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};

        if (!_.isUndefined(modifier.$set.restoredAt)) {
            // Attach soft remove
            refCollection.attachBehaviour('softRemovable');
            var selector = {
                _id: doc[refField]
            };

            refCollection.restore(selector);
        }

        //console.log('Doc->' + thisCollection._name + '.after.update()');
    });

    /********** After Update Reference Collection **********/
    refCollection.after.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};

        // Set selector
        var selector = {};
        selector[refField] = doc._id;

        //Fields specifier for Mongo.Collection.update
        var fieldsInUpdate = {};
        fieldsInUpdate[refField] = doc._id;

        // Attach soft remove
        thisCollection.attachBehaviour('softRemovable');
        if (_.isUndefined(doc.removedAt)) {
            if (_.isUndefined(doc.restoredAt)) {
                thisCollection.update(selector, {$set: fieldsInUpdate}, {multi: true});
            } else {
                thisCollection.restore(selector);
            }
        } else {
            thisCollection.softRemove(selector);
        }

        // Don't integrate with sof remove
        //thisCollection.update(selector, {$set: fieldsInUpdate}, {multi: true});

        //console.log('Doc->' + refCollection._name + '.after.update()');
    });

    /********** After Remove Reference Collection **********/
    refCollection.after.remove(function (userId, doc) {
        // Set selector
        var selector = {};
        selector[refField] = doc._id;

        thisCollection.remove(selector);

        //console.log('Doc->' + refCollection._name + '.after.remove()');
    });
};