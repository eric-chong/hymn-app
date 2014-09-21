'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	publishers = require('../../app/controllers/publishers'),
	hymnbooks = require('../../app/controllers/hymnbooks'),
	hymns = require('../../app/controllers/hymns');

module.exports = function(app) {
	// Article Routes
	app.route('/publishers')
		.get(publishers.list)
		.post(users.requiresLogin, publishers.create);

	app.route('/publishers/:publisherId')
		.get(publishers.read)
		.put(users.requiresLogin, publishers.hasAuthorization, publishers.update)
		.delete(users.requiresLogin, publishers.hasAuthorization, publishers.delete);

	app.route('/publishers/:publisherId/hymnbooks')
		.get(hymnbooks.listByPublisher)
		.post(users.requiresLogin, hymnbooks.create);

	// app.route('/publishers/:publisherId/hymbooksCount')
	// 	.get(hymnbooks.countByPublisher);

	app.route('/hymnbooks/:hymnbookId')
		.get(hymnbooks.read)
		.put(users.requiresLogin, hymnbooks.hasAuthorization, hymnbooks.update)
		.delete(users.requiresLogin, hymnbooks.hasAuthorization, hymnbooks.delete);

	app.route('/hymnbooks/:hymnbookId/hymnsCount')
		.get(hymns.countByHymnbook);

	app.route('/hymnbooks')
		.get(hymnbooks.list)
		.post(users.requiresLogin, hymnbooks.create);

	app.route('/hymnbooks/:hymnbookId/hymns')
		.get(hymns.listByHymnbook)
		.post(users.requiresLogin, hymns.create);

	app.route('/hymns/:hymnId')
		.get(hymns.read)
		.put(users.requiresLogin, hymns.hasAuthorization, hymns.update)
		.delete(users.requiresLogin, hymns.hasAuthorization, hymns.delete);

	app.route('/hymn/labels')
		.get(hymns.getLabels);

	// app.route('/hymnbooks/:hymnbookId/hymnsCount')
	// 	.get(hymns.countByHymnbook);

	// Finish by binding the article middleware
	app.param('publisherId', publishers.publisherById);
	app.param('hymnbookId', hymnbooks.hymnbookById);
	app.param('hymnId', hymns.hymnById);
};