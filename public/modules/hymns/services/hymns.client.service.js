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
					method: 'PUT',
					url: 'hymnbooks/:hymnbookId'
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
				getUnknownHymnbook: {
					method: 'GET',
					url: 'hymnbooks/unknown/hymnsCount'
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
					method: 'PUT',
					url: 'hymns/:hymnId'
				},
				delete: {
					method: 'DELETE',
					url: 'hymns/:hymnId'
				},
				getOne: {
					method: 'GET',
					url: 'hymns/:hymnId'
				},
				allLabels: {
					method: 'GET',
					url: 'hymn/labels',
					isArray: true
				}
			});
		}
	])

	.factory('HymnConfig', [function() {
		var config = {
            lyricLangs: {
                values: ['en', 'zh-CAN', 'zh-MAN'],
                displayNames: {
                	'en': 'English',
                	'zh-CAN': 'Cantonese',
                	'zh-MAN': 'Mandarin'
                }
            }
		};
		return {
			getConfig: function() {
				return config;
			}
		};
	}])

	.factory('HymnClipboard', [function() {
		var clipValue = '';
		return {
			get: function() {
				return clipValue;
			},
			set: function(value) {
				clipValue = value;
			}
		};
	}]);
