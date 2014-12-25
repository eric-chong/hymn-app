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
 * Get all hymn labels
 */
exports.getLabels = function(req, res) {
	var labels = [];
	Hymn.find({}, function(err, hymns) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			hymns.forEach(function(item) {
				if (item.labels && item.labels.length > 0) {
					labels = labels.concat(item.labels);
				}
			});
			res.jsonp(
				_(labels)
					.uniq()
					.sort()
					.value()
			);
		}
	});
};

/**
 * Hymnbooks count by publisher
 */
exports.countByHymnbook = function(req, res) {
	var hymnbook = req.hymnbook;
	Hymn.find({hymnbook: hymnbook}, function(err, hymns) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var count = hymns.length;
			var langs = [];
			hymns.forEach(function(item) {
				langs = langs.concat(item.lyricLangs);
			});
			var hymnbookId = hymnbook && hymnbook._id || !hymnbook && 'unknown';
			res.jsonp({
				hymnbookId: hymnbookId,
				hymnsCount: count,
				lyricLangs: _.uniq(langs)
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
	var hasOverrideAuth = _.intersection(req.user.roles, ['master', 'admin']).length > 0;
	if (req.hymn.user.id !== req.user.id && !hasOverrideAuth) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};