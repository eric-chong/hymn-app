'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Hymn = mongoose.model('Hymn'),
	_ = require('lodash');

/**
 * Create a publisher
 */
exports.create = function(req, res) {
	var hymn = new Hymn(req.body);
	hymn.hymnbook = req.hymnbook;
	hymn.user = req.user;

	hymn.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymn);
		}
	});
};

/**
 * List of Hymns by hymnbook
 */
exports.listByHymnbook = function(req, res) {
	var hymnbook = req.hymnbook;
	Hymn.find({hymnbook: hymnbook}).populate('user').populate('hymnbook').exec(function(err, hymns) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymns);
		}
	});
};

/**
 * Show the current hyn
 */
exports.read = function(req, res) {
	res.jsonp(req.hymn);
};

/**
 * Update a hymn
 */
exports.update = function(req, res) {
	var hymn = req.hymn;

	hymn = _.extend(hymn, req.body);

	hymn.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymn);
		}
	});
};

/**
 * Delete an hymn
 */
exports.delete = function(req, res) {
	var hymn = req.hymn;

	hymn.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymn);
		}
	});
};

/**
 * Hymnbooks count by publisher
 */
exports.countByHymnbook = function(req, res) {
	var hymnbook = req.hymnbook;
	Hymn.count({hymnbook: hymnbook}, function(err, count) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp({
				hymnbookId: hymnbook._id,
				hymnsCount: count
			});
		}
	});
};

/**
 * Hymn middleware
 */
exports.hymnById = function(req, res, next, id) {
	Hymn.findById(id).populate('user').populate('hymnbook').exec(function(err, hymn) {
		if (err) return next(err);
		if (!hymn) return next(new Error('Failed to load hymn ' + id));
		req.hymn = hymn;
		next();
	});
};

/**
 * Hymn authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hymn.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};