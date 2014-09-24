'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Publisher Schema
 */
var OrgSchema = new Schema({
	orgCode: { type: String, unique: true },
	fullName: String
});

mongoose.model('Org', OrgSchema);