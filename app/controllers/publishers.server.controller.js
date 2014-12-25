'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Publisher = mongoose.model('Publisher'),
	Hymnbook = mongoose.model('Hymnbook'),
	Hymn = mongoose.model('Hymn'),
	_ = require('lodash');

/**
 * Private method to retrieve counts
 */
function getHymnbooksAndHymnsCount(publishers) {
	// if (_.isArray(publishers)) {
	// 	publishers.forEach(function(elem, index) {
	// 		Hymnbook.count({publisher: elem}, function(err, count) {
	// 			publishers[index].hymnbookCount = count;
	// 			publishers[index].names[0].name = 'test';
	// 			console.log('-- get count');
	// 			//console.log(elem);
	// 			//console.log(count);
	// 		});			
	// 	});
	// }

	Hymnbook.aggregate({
		$group: { 
			_id: '$publisher',
			count: { $sum: 1 }
		}
	}, function(err, res) {
		if (err) return undefined;

		return res;
	});
}

/**
 * Create a publisher
 */
exports.create = function(req, res) {
	var publisher = new Publisher(req.body);
	publisher.user = req.user;

	publisher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(publisher);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.jsonp(req.publisher);
};

/**
 * Update a publisher
 */
exports.update = function(req, res) {
	var publisher = req.publisher;

	publisher = _.extend(publisher, req.body);

	publisher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(publisher);
		}
	});
};

/**
 * Delete an publisher
 */
exports.delete = function(req, res) {
	var publisher = req.publisher;

	publisher.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(publisher);
		}
	});
};

/**
 * List of Publishers
 */
exports.list = function(req, res) {
	Publisher.find().populate('user').exec(function(err, publishers) {
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
 * Publisher middleware
 */
exports.publisherById = function(req, res, next, id) {
	Publisher.findById(id).populate('user').exec(function(err, publisher) {
		if (err) return next(err);
		if (!publisher) return next(new Error('Failed to load publisher ' + id));
		req.publisher = publisher;
		next();
	});
};

/**
 * Publisher authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var hasOverrideAuth = _.intersection(req.user.roles, ['master', 'admin']).length > 0;
	if (req.publisher.user.id !== req.user.id && !hasOverrideAuth) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

