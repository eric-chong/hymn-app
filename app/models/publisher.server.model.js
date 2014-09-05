'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Hymnbook = mongoose.model('Hymnbook'),
	commonUtils = require('../utils/commonUtils.js');

/**
 * Publisher Schema
 */
var PublisherSchema = new Schema({
	names: [{
		lang: String,
		name: String
	}],
	hymnbooksCount: {
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
	}
});
PublisherSchema.virtual('nameObj').get(function() {
	return commonUtils.arrayToObject( this.names, 'lang', 'name' );
});

mongoose.model('Publisher', PublisherSchema);