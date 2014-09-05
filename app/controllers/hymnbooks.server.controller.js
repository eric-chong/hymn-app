'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Hymnbook = mongoose.model('Hymnbook'),
	_ = require('lodash');

/**
 * Create a publisher
 */
exports.create = function(req, res) {
	var hymnbook = new Hymnbook(req.body);
	if (req.publisher) {
		hymnbook.publisher = req.publisher;	
	}
	hymnbook.user = req.user;

	hymnbook.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymnbook);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.jsonp(req.hymnbook);
};

/**
 * Update a publisher
 */
exports.update = function(req, res) {
	var hymnbook = req.hymnbook;

	hymnbook = _.extend(hymnbook, req.body);

	hymnbook.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymnbook);
		}
	});
};

/**
 * Delete an publisher
 */
exports.delete = function(req, res) {
	var hymnbook = req.hymnbook;

	hymnbook.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymnbook);
		}
	});
};

/**
 * List of all Hymnbooks
 */
exports.list = function(req, res) {
	Hymnbook.find().populate('user').populate('publisher').exec(function(err, publishers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(publishers);
		}
	});
};

/**
 * List of Hymnbooks by publisher
 */
exports.listByPublisher = function(req, res) {
	var publisher = req.publisher;
	Hymnbook.find({publisher: publisher}).populate('user').populate('publisher').exec(function(err, hymnbooks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hymnbooks);
		}
	});
};

/**
 * Hymnbooks count by publisher
 */
exports.countByPublisher = function(req, res) {
	var publisher = req.publisher;
	Hymnbook.count({publisher: publisher}, function(err, count) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//publisher.hymnbooksCount = count;
			res.jsonp({
				publisherId: publisher._id,
				hymnbooksCount: count
			});
		}
	});
};

/**
 * Hymnbook middleware
 */
exports.hymnbookById = function(req, res, next, id) {
	Hymnbook.findById(id).populate('user').populate('publisher').exec(function(err, hymnbook) {
		if (err) return next(err);
		if (!hymnbook) return next(new Error('Failed to load hymnbook ' + id));
		req.hymnbook = hymnbook;
		next();
	});
};

/**
 * Hymnbook authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hymnbook.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
