'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user;
	var updateByAdmin = (req.profile);
	if (updateByAdmin) {
		user = req.profile;
	} else {
		user = req.user;
	}
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				if (!updateByAdmin) {
					req.login(user, function(err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.jsonp(user);
						}
					});
				} else {
					res.jsonp(user);
				}
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/*
 * List of users
 */
exports.list = function(req, res) {
	var user = req.user;
	var org = req.org;

	if (user) {
		if (!org) {
			// get list of all users.
			User.find().populate('org').exec(function(err, users) {
				res.jsonp(users);
			});
		} else {
			User.find({org: org}).populate('org').exec(function(err, users) {
				res.jsonp(users);
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};