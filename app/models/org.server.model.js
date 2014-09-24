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
	orgId: { type: String, unique: true },
	fullName: String
});

mongoose.model('Org', OrgSchema);