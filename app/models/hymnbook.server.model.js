'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	commonUtils = require('../utils/commonUtils.js');

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
	var Hymnbook = mongoose.model('Hymnbook');
	var Publisher = mongoose.model('Publisher');
	var savedPublisher = doc.publisher;
	Hymnbook.find({publisher: savedPublisher}).populate('publisher').exec(function(err, hymnbooks) {
		if (!err) {
			if (hymnbooks[0].publisher) {
				var publisherId = hymnbooks[0].publisher._id;
				var hymnbooksCount = hymnbooks.length;
				Publisher.findById(publisherId).exec(function(err, publisher) {
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
		}
	});
});

mongoose.model('Hymnbook', HymnbookSchema);