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
	name: String,
	org: {
		type: Schema.ObjectId,
		ref: 'Org'
	},
	// roles: [String]
  programs: [{
    key: { type: String, unique: true },
    name: String,
    hasSlide: { type: Boolean, default: true },
    slideType: { type: String, required: true },
    slideContents: [String],
    scripture: {
      book: String,
      chapter: String,
      verse: String
    }
  }]
});

EventTypeSchema.index({type: 1, org: 1}, {unique: true});

mongoose.model('EventType', EventTypeSchema);