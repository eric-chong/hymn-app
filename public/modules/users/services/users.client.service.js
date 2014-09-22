'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users')

	.factory('Users', ['$resource',
		function($resource) {
			return $resource('users', {}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])

	.factory('UserUntil', [function() {
		var roles = {
			'user': 'User',
			'admin': 'Admin',
			'master': 'Master'
		};
		return {
			getRoles: function(currentUserRoles) {
				var roles= {
					values: [],
					displayName: {}
				};
				if (!_.isArray(currentUserRoles)) return roles;

				if (_.indexOf(currentUserRoles, 'admin') > -1 || _.indexOf(currentUserRoles, 'master') > -1) {
					roles.values.push('user');
					roles.displayName.user = 'User';
					roles.values.push('admin');
					roles.displayName.admin = 'Admin';
				}
				if (_.indexOf(currentUserRoles, 'master') > -1) {
					roles.values.push('master');
					roles.displayName.master = 'Master';
				}

				return roles;
			}
		};
	}]);