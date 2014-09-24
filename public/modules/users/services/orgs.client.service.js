'use strict';

// Orgs service used for communicating with the orgs REST endpoint
angular.module('users')

	.factory('Orgs', ['$resource',
		function($resource) {
			return $resource('orgs/:orgId', {
				orgId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	]);