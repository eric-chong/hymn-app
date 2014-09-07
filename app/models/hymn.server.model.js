'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash'),
	commonUtils = require('../utils/commonUtils.js');

function updateHymnbook(hymnDoc) {
	var Hymn = mongoose.model('Hymn');
	var Hymnbook = mongoose.model('Hymnbook');
	var savedHymnbook = hymnDoc.hymnbook;
	if (savedHymnbook) {
		var listOfAllLangs = [];
		var concatedLangs = [];
		Hymn.find({hymnbook: savedHymnbook}).populate('hymnbook').exec(function(err, hymns) {
			if (!err) {
				hymns.forEach(function(elem) {
					listOfAllLangs.push(elem.lyricLangs);
				});
				var hymnsCount = hymns.length;
				concatedLangs = _(listOfAllLangs).flatten().uniq().value();
				Hymnbook.findById(savedHymnbook).exec(function(err, hymnbook) {
					hymnbook.hymnsCount = hymnsCount;
					hymnbook.lyricLangs = concatedLangs;
					hymnbook.save(function(err) {
						if(!err) {
							console.log('hymnbook(' + hymnbook._id + ') updated.');
						}
						else {
							console.log('Error: could not update hymnbook(' + hymnbook._id + ')');
						}
					});
				});
			}
		});
	}
}

/**
 * Hymn Schema
 */
var HymnSchema = new Schema({
	names: [{
		lang: String,
		name: String
	}],
	lyricLangs: [String],
	lyricsList: [{
		lang: [String],
		lyrics: [{
			verse: String,
			lines: [String]
		}],
		slideIndexes: [Number]
	}],
	defaultArrangement: [String],
	labels: [String],
	hymnbookIndex: String,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	hymnbook: {
		type: Schema.ObjectId,
		ref: 'Hymnbook'
	}
});

HymnSchema.pre('save', function (next) {
	//var err = new Error('something went wrong');
	//next(err);

	// .pre('save') to check hymnbookIndex is unique in given hymnbook
	next();
});
HymnSchema.post('save', function (doc) {
	updateHymnbook(doc);
});
HymnSchema.post('remove', function(doc) {
	updateHymnbook(doc);
});

mongoose.model('Hymn', HymnSchema);