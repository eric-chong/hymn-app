'use strict';

angular.module('users').controller('OrgsController', ['$scope', '$location', '$modal', 'Orgs', 'Authentication', 'AuthService',
	function($scope, $location, $modal, Orgs, Authentication, AuthService) {
		$scope.authentication = Authentication;

		// If user is not signed in or not master role then redirect back home
		if (!$scope.authentication.user || !AuthService.hasMasterAuthorization($scope.authentication)) $location.path('/');

		$scope.show = {
			newSection: false
		};

		$scope.loadOrgs = function() {
			$scope.orgs = Orgs.query();
		};

		$scope.createOrg = function() {
			validateOrgForm($scope.newOrgForm, $scope.newOrg);
			if ($scope.newOrgForm.$valid) {
				var orgToSave = new Orgs({
					orgCode: $scope.newOrg.orgCode,
					fullName: $scope.newOrg.fullName
				});
				orgToSave.$save(function(response) {
					resetNewOrgList();
					$scope.loadOrgs();
					$scope.show.newSection = false;
				}, function(response) {
					//  Add error message
				});					
			}
		};

		$scope.delete = function(org) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
				controller: 'DeleteItemController',
				windowClass: 'delete-item-modal',
				resolve: {
					itemToDelete: function () {
						return org;
					},
					deleteMsg: function() {
						return 'Confirm Delete Org?';
					}
				}
			});

			modalInstance.result.then(function (org) {
				org.$delete(function(response) {
					$scope.loadOrgs();
				});
			});
		};

		$scope.cancelNew = function() {
			$scope.show.newSection = false;
			resetNewOrgList();
		};

		$scope.saveOrg = function(org) {
			org.$update(function(response) {
				// load success message
			});
		};

		$scope.hasWriteAuthorization = function(item) {
			return AuthService.hasWriteAuthorization($scope.authentication, item);
		};

		function resetNewOrgList() {
			$scope.newOrg = {};
		}

		function validateOrgForm(form, obj) {
			if (obj.orgCode === undefined || obj.orgCode === '') {
				form.orgCode.$setValidity('required', false);
			} else {
				form.orgCode.$setValidity('required', true);
			}
			if (obj.fullName === undefined || obj.fullName === '') {
				form.fullName.$setValidity('required', false);
			} else {
				form.fullName.$setValidity('required', true);
			}
		}

		resetNewOrgList();
	}
]);
