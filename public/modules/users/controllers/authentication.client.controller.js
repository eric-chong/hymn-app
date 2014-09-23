'use strict';

angular.module('users').controller('SigninController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
])

.controller('AddUserController', ['$scope', '$http', '$location', 'Authentication', 'UserUntil',
	function($scope, $http, $location, Authentication, UserUntil) {
		$scope.authentication = Authentication;

		$scope.credentials = {
			roles: []
		};

		function allowAddUser() {
			return $scope.authentication.user && 
				(_.indexOf($scope.authentication.user.roles, 'admin') > -1 || _.indexOf($scope.authentication.user.roles, 'master') > -1);
		}

		// If user is signed in then redirect back home
		if ($scope.authentication.user && !allowAddUser()) $location.path('/');

		$scope.availableRoles = UserUntil.getRoles($scope.authentication.user.roles);

		$scope.addUser = function() {
			// TO-DO: validation
			
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.showRolesCheckbox = function() {
			return $scope.authentication.user && $scope.authentication.user.roles && 
				($scope.authentication.user.roles.indexOf('admin') > -1 || $scope.authentication.user.roles.indexOf('master') > -1);
		};
	}
]);