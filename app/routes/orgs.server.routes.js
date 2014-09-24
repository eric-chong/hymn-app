'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	orgs = require('../../app/controllers/orgs');

module.exports = function(app) {
	// User Routes
	var orgs = require('../../app/controllers/orgs');

	app.route('/orgs')
		.get(orgs.list)
		.post(users.requiresLogin, orgs.create);

	app.route('/orgs/:orgId')
		.get(orgs.read)
		.put(users.requiresLogin, orgs.update)
		.delete(users.requiresLogin, orgs.delete);

	// Finish by binding the article middleware
	app.param('orgId', orgs.orgByID);
};
