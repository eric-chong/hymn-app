'use strict';

// hymns service used for communicating with the REST endpoints
angular.module('hymns')

	.factory('Publishers', ['$resource',
		function($resource) {
			return $resource('publishers/:publisherId', {
				publisherId: '@_id'
			}, {
				update: {
					method: 'PUT'
				},
				getHymnbooksCount: {
					method: 'GET',
					url: 'publishers/:publisherId/hymbooksCount'
				}
			});
		}
	])

	.factory('Hymnbooks', ['$resource',
		function($resource) {
			return $resource('publishers/:publisherId/hymnbooks/:hymnbookId', {
				publisherId: '@publisherId',
				hymnbookId: '@_id'
			}, {
				update: {
					method: 'PUT'
				},
				delete: {
					method: 'DELETE',
					url: 'hymnbooks/:hymnbookId'
				},
				getAll: {
					method: 'GET',
					url: 'hymnbooks',
					isArray: true
				},
				getOne: {
					method: 'GET',
					url: 'hymnbooks/:hymnbookId'
				},
				getHymnsCount: {
					method: 'GET',
					url: 'hymnbooks/:hymnbookId/hymnsCount'
				},
				saveWithNoPublisher: {
					method: 'POST',
					url: 'hymnbooks'
				}
			});
		}
	])

	.factory('Hymns', ['$resource',
		function($resource) {
			return $resource('hymnbooks/:hymnbookId/hymns/:hymnId', {
				hymnbookId: '@hymnbookId',
				hymnId: '@_id'
			}, {
				update: {
					method: 'PUT'
				},
				delete: {
					method: 'DELETE',
					url: 'hymns/:hymnId'
				}
			});
		}
	]);