'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * EventType Schema
 */
var EventTypeSchema = new Schema({
	type: String,
	org: {
		type: Schema.ObjectId,
		ref: 'Org'
	},
	roles: [String]
});

EventTypeSchema.index({type: 1, org: 1}, {unique: true});

mongoose.model('EventType', EventTypeSchema);