'use strict';

angular.module('users')

	.controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'UserUtil',
		function($scope, $http, $location, Users, Authentication, UserUtil) {
			$scope.user = Authentication.user;

			// If user is not signed in then redirect back home
			if (!$scope.user) $location.path('/');

			$scope.availableRoles = UserUtil.getRoles($scope.user.roles);

			// Check if there are additional accounts 
			$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
				for (var i in $scope.user.additionalProvidersData) {
					return true;
				}

				return false;
			};

			$scope.hasAdminAuthentication = function() {
				return $scope.user && 
					(_.indexOf($scope.user.roles, 'admin') > -1 || _.indexOf($scope.user.roles, 'master') > -1);
			};

			// Check if provider is already in use with current user
			$scope.isConnectedSocialAccount = function(provider) {
				return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
			};

			// Remove a user social account
			$scope.removeUserSocialAccount = function(provider) {
				$scope.success = $scope.error = null;

				$http.delete('/users/accounts', {
					params: {
						provider: provider
					}
				}).success(function(response) {
					// If successful show success message and clear form
					$scope.success = true;
					$scope.user = Authentication.user = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			};

			// Update a user profile
			$scope.updateUserProfile = function(isValid) {
				if (isValid){
					$scope.success = $scope.error = null;
					var user = new Users($scope.user);
		
					user.$update(function(response) {
						$scope.success = true;
						Authentication.user = response;
					}, function(response) {
						$scope.error = response.data.message;
					});
				} else {
					$scope.submitted = true;
				}
			};

			// Change user password
			$scope.changeUserPassword = function() {
				$scope.success = $scope.error = null;

				$http.post('/users/password', $scope.passwordDetails).success(function(response) {
					// If successful show success message and clear form
					$scope.success = true;
					$scope.passwordDetails = null;
				}).error(function(response) {
					$scope.error = response.message;
				});
			};
		}
	])

	.controller('UsersController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'AuthService', 'UserUtil',
		function($scope, $http, $location, Users, Authentication, AuthService, UserUtil) {
			$scope.authentication = Authentication;

			// If user is not signed in then redirect back home
			if (!$scope.authentication.user) $location.path('/');

			$scope.availableRoles = UserUtil.getRoles($scope.authentication.user.roles);

			// Get all users for master
			// Get only users in org for admin
			// Redirect to home if not master and admin
			if (AuthService.hasMasterAuthorization($scope.authentication)) {
				$scope.users = Users.query();	
			} else if (AuthService.hasAdminAuthorization($scope.authentication) && $scope.authentication.user.org) {
				$scope.users = Users.getUsersInOrg({
					orgId: $scope.authentication.user.org
				});
			} else {
				$location.path('/');
			}

			$scope.hasAdminAuthentication = function() {
				return AuthService.hasAdminAuthorization($scope.authentication);
			};
			
			$scope.toggleEditSection = function(user) {
				user.editShow = !user.editShow;
				if (user.editShow) {
					closeOthers(user);
				}
			};

			$scope.saveUser = function(user) {
				user.$updateOneUser({userId: user._id},
					function(response) {
					$scope.success = true;
				}, function(response) {
					$scope.error = response.data.message;
				});
			};

			function closeOthers(user) {
				$scope.users.forEach(function(u) {
					if (u._id !== user._id && u.editShow) {
						u.editShow = false;
					}
				});
			}

		}
	]);
