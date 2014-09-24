'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'AuthService', 'Menus',
	function($scope, Authentication, AuthService, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.showUsersMenu = function() {
			return AuthService.hasAdminAuthorization($scope.authentication);
		};
	}
]);