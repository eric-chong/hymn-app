'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash'),
	commonUtils = require('../utils/commonUtils.js');

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
	var Hymn = mongoose.model('Hymn');
	var Hymnbook = mongoose.model('Hymnbook');
	var savedHymnbook = doc.hymnbook;
	var listOfAllLangs = [];
	var concatedLangs = [];
	Hymn.find({hymnbook: savedHymnbook}).populate('hymnbook').exec(function(err, hymns) {
		if (!err) {
			if (hymns[0].hymnbook) {
				var hymnbookToLookUp;
				if (hymns.length > 0) hymnbookToLookUp = hymns[0].hymnbook;
				hymns.forEach(function(elem) {
					listOfAllLangs.push(elem.lyricLangs);
				});
				var hymnsCount = hymns.length;
				concatedLangs = _(listOfAllLangs).flatten().uniq().value();
				Hymnbook.findById(hymnbookToLookUp._id).exec(function(err, hymnbook) {
					hymnbook.hymnsCount = hymnsCount;
					hymnbook.lyricLangs = concatedLangs;
					hymnbook.save(function(err) {
						if(!err) {
							console.log('hymnbook(' + hymnbook._id + ') lyricLangs updated.');
						}
						else {
							console.log('Error: could not update hymnbook(' + hymnbook._id + ') lyricLangs');
						}
					});
				});
			}
		}
	});
});
HymnSchema.virtual('nameObj').get(function() {
	return commonUtils.arrayToObject( this.names, 'lang', 'name' );
});

mongoose.model('Hymn', HymnSchema);