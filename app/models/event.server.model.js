'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	date: String,
	eventType: {
		type: Schema.ObjectId,
		ref: 'EventType'
	},
	roleAssignments: [{
		role: String,
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	}]
});

mongoose.model('Event', EventSchema);