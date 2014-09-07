'use strict';

angular.module('hymns')
	.controller('PublishersController', ['$scope', '$modal', 'Authentication', 'Publishers', 
		function($scope, $modal, Authentication, Publishers) {
			$scope.authentication = Authentication;

			$scope.show = {
				newSection: false
			};

			$scope.loadPublishers = function() {
				$scope.publishers = Publishers.query();
			};

			$scope.createPublisher = function() {
				validatePublisherForm($scope.newPublisherForm, $scope.newPublisher);
				// if (!$scope.newPublisher.names[0].name && !$scope.newPublisher.names[1].name) {
				// 	$scope.newPublisherForm.name.$setValidity('oneRequired', false);
				// } else {
				// 	$scope.newPublisherForm.name.$setValidity('oneRequired', true);
				// }
				if ($scope.newPublisherForm.$valid) {
					var publisherToSave = new Publishers({
						names: []
					});
					$scope.newPublisher.names.forEach(function(elem) {
						if (elem.name) publisherToSave.names.push(elem);
					});
					publisherToSave.$save(function(response) {
						resetNewPublisherList();
						$scope.loadPublishers();
						$scope.show.newSection = false;
					}, function(response) {
						//  Add error message
					});					
				}
			};

			$scope.delete = function(publisher) {
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
					controller: 'DeleteItemController',
					windowClass: 'delete-item-modal',
					resolve: {
						itemToDelete: function () {
							return publisher;
						}
					}
				});

				modalInstance.result.then(function (publisher) {
					publisher.$delete(function(response) {
						$scope.loadPublishers();
					});
				});
			};

			$scope.edit = function(publisher) {
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-edit-publisher.client.view.html',
					controller: 'EditItemController',
					windowClass: 'edit-item-modal',
					resolve: {
						itemToEdit: function () {
							return publisher;
						},
						validateFn: function() {
							return validatePublisherForm;
						}
					}
				});

				modalInstance.result.then(function (publisher) {
					publisher.$update(function(response) {
						$scope.loadPublishers();
					});
				});
			};

			$scope.cancelNew = function() {
				$scope.show.newSection = false;
				resetNewPublisherList();
			};

			function resetNewPublisherList() {
				$scope.newPublisher = {
					names: [
						{ lang: 'zh', name: '' },
						{ lang: 'en', name: '' }
					]
				};
			}

			function validatePublisherForm(form, obj) {
				if (!obj.names[0].name && !obj.names[1].name) {
					form.name.$setValidity('oneRequired', false);
				} else {
					form.name.$setValidity('oneRequired', true);
				}
			}

			resetNewPublisherList();
		}])

	.controller('HymnbooksController', ['$scope', '$state', '$stateParams', '$modal', 'Authentication', 'Publishers', 'Hymnbooks',
		function($scope, $state, $stateParams, $modal, Authentication, Publishers, Hymnbooks){
			$scope.currentState = $state.current;
			$scope.authentication = Authentication;

			$scope.show = {
				newSection: false,
				filterSection: false
			};

			$scope.publisherSelectOption = {
				allowClear: true
			};

			$scope.search = {
				langs: {}
			};

			$scope.parentInfo = {
				parent: 'publishers',
				child: 'hymnbooks',
				title: 'Publisher'
			};

			$scope.loadHymnbooks = function() {
				if ($scope.currentState.name === 'listHymnbooksInPublisher') {
					$scope.parentInfo.obj = Publishers.get({
						publisherId: $stateParams.publisherId
					});
					$scope.hymnbooks = Hymnbooks.query({
						publisherId: $stateParams.publisherId
					});
				} else {
					$scope.hymnbooks = Hymnbooks.getAll();
					$scope.publishersList = Publishers.query();
				}
			};

			$scope.createHymnbook = function() {
				if (!$scope.newHymnbook.names[0].name && !$scope.newHymnbook.names[1].name) {
					$scope.newHymnbookForm.name.$setValidity('oneRequired', false);
				} else {
					$scope.newHymnbookForm.name.$setValidity('oneRequired', true);
				}
				if (!$scope.newHymnbook.lyricLangs[0].checked && 
					!$scope.newHymnbook.lyricLangs[1].checked && 
					!$scope.newHymnbook.lyricLangs[2].checked) {
					$scope.newHymnbookForm.lyricLangs.$setValidity('oneRequired', false);
				} else {
					$scope.newHymnbookForm.lyricLangs.$setValidity('oneRequired', true);
				}
				if ($scope.newHymnbookForm.$valid) {
					var hymnbookToSave;
					if ($stateParams.publisherId || $scope.newHymnbook.publisherId) {
						hymnbookToSave = new Hymnbooks({
							publisherId: $stateParams.publisherId || $scope.newHymnbook.publisherId,
							names: [],
							lyricLangs: []
						});
					} else {
						hymnbookToSave = new Hymnbooks({
							names: [],
							lyricLangs: []
						});
					}
					$scope.newHymnbook.names.forEach(function(elem) {
						if (elem.name) hymnbookToSave.names.push(elem);
					});
					if ($scope.newHymnbook.year) {
						hymnbookToSave.year = $scope.newHymnbook.year;
					}
					$scope.newHymnbook.lyricLangs.forEach(function(elem) {
						if (elem.checked) hymnbookToSave.lyricLangs.push(elem.lang);
					});
					if ($stateParams.publisherId || $scope.newHymnbook.publisherId) {
						hymnbookToSave.$save(function(response) {
							resetNewHymnbookObj();
							$scope.loadHymnbooks();
							$scope.show.newSection = false;
						}, function(response) {
							// add error message
						});						
					} else {
						hymnbookToSave.$saveWithNoPublisher(function(response) {
							resetNewHymnbookObj();
							$scope.loadHymnbooks();
							$scope.show.newSection = false;
						}, function(response) {
							// add error message
						});
					}
				}
			};

			$scope.delete = function(hymnbook) {
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
					controller: 'DeleteItemController',
					windowClass: 'delete-item-modal',
					resolve: {
						itemToDelete: function () {
							return hymnbook;
						}
					}
				});

				modalInstance.result.then(function (hymnbook) {
					hymnbook.$delete(function(response) {
						$scope.loadHymnbooks();
					});
				});
			};

			$scope.cancelNew = function() {
				$scope.show.newSection = false;
				resetNewHymnbookObj();
			};

			function resetNewHymnbookObj() {
				$scope.newHymnbook = {
					names: [
						{ lang: 'zh', name: '' },
						{ lang: 'en', name: '' }
					],
					lyricLangs: [
						{ lang: 'en', displayName: 'English', checked: false },
						{ lang: 'zh-CAN', displayName: 'Cantonese', checked: false },
						{ lang: 'zh-MAN', displayName: 'Mandarin', checked: false }
					]
				};
			}

			resetNewHymnbookObj();
		}])

	.controller('HymnsController', ['$scope', '$state', '$stateParams', '$modal', 'Authentication', 'Hymnbooks', 'Hymns',
		function($scope, $state, $stateParams, $modal, Authentication, Hymnbooks, Hymns){
			$scope.currentState = $state.current;
			$scope.authentication = Authentication;

			$scope.show = {
				newSection: false
			};

			$scope.parentInfo = {
				parent: 'hymnbooks',
				child: 'hymns',
				title: 'Hymn Book'
			};

			$scope.loadHymns = function() {
				if ($scope.currentState.name === 'listHymnsInHymnbook') {
					$scope.parentInfo.obj = Hymnbooks.getOne({
						hymnbookId: $stateParams.hymnbookId
					});
					$scope.hymns = Hymns.query({
						hymnbookId: $stateParams.hymnbookId
					});
				}
			};

			$scope.createHymn = function() {
				if (!$scope.newHymn.names[0].name && !$scope.newHymn.names[1].name) {
					$scope.newHymnForm.name.$setValidity('oneRequired', false);
				} else {
					$scope.newHymnForm.name.$setValidity('oneRequired', true);
				}
				if (!$scope.newHymn.lyricLangs[0].checked && 
					!$scope.newHymn.lyricLangs[1].checked && 
					!$scope.newHymn.lyricLangs[2].checked) {
					$scope.newHymnForm.lyricLangs.$setValidity('oneRequired', false);
				} else {
					$scope.newHymnForm.lyricLangs.$setValidity('oneRequired', true);
				}
				if ($scope.newHymnForm.$valid) {
					var hymnToSave = new Hymns({
						hymnbookId: $stateParams.hymnbookId,
						names: [],
						lyricLangs: []
					});
					$scope.newHymn.names.forEach(function(elem) {
						if (elem.name) hymnToSave.names.push(elem);
					});
					$scope.newHymn.lyricLangs.forEach(function(elem) {
						if (elem.checked) hymnToSave.lyricLangs.push(elem.lang);
					});
					hymnToSave.$save(function(response) {
						resetNewHymnObj();
						$scope.loadHymns();
						$scope.show.newSection = false;
					}, function(response) {
						// add error message
					});

				}
			};

			$scope.delete = function(hymn) {
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
					controller: 'DeleteItemController',
					windowClass: 'delete-item-modal',
					resolve: {
						itemToDelete: function () {
							return hymn;
						}
					}
				});

				modalInstance.result.then(function (hymn) {
					hymn.$delete(function(response) {
						$scope.loadHymns();
					});
				});
			};

			$scope.cancelNew = function() {
				$scope.show.newSection = false;
				resetNewHymnObj();
			};

			function resetNewHymnObj() {
				$scope.newHymn = {
					names: [
						{ lang: 'zh', name: '' },
						{ lang: 'en', name: '' }
					],
					lyricLangs: [
						{ lang: 'en', displayName: 'English', checked: false },
						{ lang: 'zh-CAN', displayName: 'Cantonese', checked: false },
						{ lang: 'zh-MAN', displayName: 'Mandarin', checked: false }
					]
				};
			}

			resetNewHymnObj();
		}])

	.controller('DeleteItemController', ['$scope', '$modalInstance', 'itemToDelete', 
		function($scope, $modalInstance, itemToDelete) {
			$scope.itemToDelete = itemToDelete;

			$scope.confirm = function() {
				$modalInstance.close($scope.itemToDelete);
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}])

	.controller('EditItemController', ['$scope', '$modalInstance', 'itemToEdit', 'validateFn', 
		function($scope, $modalInstance, itemToEdit, validateFn) {
			$scope.itemToEdit = itemToEdit;

			$scope.save = function(editForm) {
				validateFn(editForm, $scope.itemToEdit);
				if (editForm.$valid) {
					$modalInstance.close($scope.itemToEdit);	
				}
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}])

	.controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
		function($scope, $stateParams, $location, Authentication, Articles) {
			$scope.authentication = Authentication;

			$scope.create = function() {
				var article = new Articles({
					title: this.title,
					content: this.content
				});
				article.$save(function(response) {
					$location.path('articles/' + response._id);

					$scope.title = '';
					$scope.content = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			$scope.remove = function(article) {
				if (article) {
					article.$remove();

					for (var i in $scope.articles) {
						if ($scope.articles[i] === article) {
							$scope.articles.splice(i, 1);
						}
					}
				} else {
					$scope.article.$remove(function() {
						$location.path('articles');
					});
				}
			};

			$scope.update = function() {
				var article = $scope.article;

				article.$update(function() {
					$location.path('articles/' + article._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			$scope.find = function() {
				$scope.articles = Articles.query();
			};

			$scope.findOne = function() {
				$scope.article = Articles.get({
					articleId: $stateParams.articleId
				});
			};
		}
	]);