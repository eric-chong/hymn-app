'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	commonUtils = require('../utils/commonUtils.js');

function updatePublisher(hymnbookDoc) {
	var Hymnbook = mongoose.model('Hymnbook');
	var Publisher = mongoose.model('Publisher');
	var savedPublisher = hymnbookDoc.publisher;
	if (savedPublisher) {
		var publisherId = savedPublisher._id;	
		Hymnbook.find({publisher: savedPublisher}).populate('publisher').exec(function(err, hymnbooks) {
			if (!err) {
				var hymnbooksCount = hymnbooks.length;
				Publisher.findById(savedPublisher).exec(function(err, publisher) {
					publisher.hymnbooksCount = hymnbooksCount;
					publisher.save(function(err) {
						if(!err) {
							console.log('publisher(' + publisher._id + ') hymnbooksCount updated.');
						}
						else {
							console.log('Error: could not update publisher(' + publisher._id + ') hymnbooksCount');
						}
					});
				});				
			}
		});

	}
}
/**
 * Hymnbook Schema
 */
var HymnbookSchema = new Schema({
	names: [{
		lang: String,
		name: String
	}],
	year: Number,
	lyricLangs: [String],
	hymnsCount: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	publisher: {
		type: Schema.ObjectId,
		ref: 'Publisher'
	}
});
HymnbookSchema.virtual('nameObj').get(function() {
	return commonUtils.arrayToObject( this.names, 'lang', 'name' );
});
HymnbookSchema.post('save', function (doc) {
	updatePublisher(doc);
});
HymnbookSchema.post('remove', function (doc) {
	updatePublisher(doc);
});

mongoose.model('Hymnbook', HymnbookSchema);