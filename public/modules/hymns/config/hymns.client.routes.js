'use strict';

// Setting up route
angular.module('hymns').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider
			.state('listPublishers', {
				url: '/publishers',
				templateUrl: 'modules/hymns/views/list-publishers.client.view.html'
			})
			.state('listHymnbooksInPublisher', {
				url: '/publishers/:publisherId/hymnbooks',
				templateUrl: 'modules/hymns/views/list-hymnbooks.client.view.html'
			})
			.state('listAllHymnBooks', {
				url: '/hymnbooks',
				templateUrl: 'modules/hymns/views/list-hymnbooks.client.view.html'
			})
			.state('listHymnsInHymnbook', {
				url: '/hymnbooks/:hymnbookId/hymns',
				templateUrl: 'modules/hymns/views/list-hymns.client.view.html'
			})
			.state('viewHymn', {
				url: '/hymns/:hymnId',
				templateUrl: 'modules/hymns/views/view-hymn.client.view.html'
			});
	}
]);