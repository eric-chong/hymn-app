'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Org = mongoose.model('Org'),
	_ = require('lodash');

/**
 * Create an org
 */
exports.create = function(req, res) {
	var org = new Org(req.body);
	
	org.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(org);
		}
	});
};

/**
 * Show the current org
 */
exports.read = function(req, res) {
	res.jsonp(req.org);
};

/**
 * Update an org
 */
exports.update = function(req, res) {
	var org = req.org;

	org = _.extend(org, req.body);

	org.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(org);
		}
	});
};

/**
 * Delete an org
 */
exports.delete = function(req, res) {
	var org = req.org;

	org.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(org);
		}
	});
};

/**
 * List of Orgs
 */
exports.list = function(req, res) {
	Org.find().sort('-created').populate('user', 'displayName').exec(function(err, orgs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orgs);
		}
	});
};

/**
 * Org middleware
 */
exports.orgByID = function(req, res, next, id) {
	Org.findById(id).exec(function(err, org) {
		if (err) return next(err);
		if (!org) return next(new Error('Failed to load org ' + id));
		req.org = org;
		next();
	});
};
