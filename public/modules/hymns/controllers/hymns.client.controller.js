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
						},
						deleteMsg: function() {
							return '';
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
						selectLists: function() {
							return {};
						},
						checkboxItems: function() {
							return {};
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

	.controller('HymnbooksController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'Authentication', 'Publishers', 'Hymnbooks', 'HymnConfig',
		function($scope, $state, $stateParams, $timeout, $modal, Authentication, Publishers, Hymnbooks, HymnConfig){
			$scope.currentState = $state.current;
			$scope.authentication = Authentication;

			$scope.show = {
				newSection: false,
				filterSection: false
			};

			$scope.search = {
				langs: []
			};

			$scope.parentInfo = {
				parent: 'publishers',
				child: 'hymnbooks',
				title: 'Publisher'
			};

			$scope.lyricLangs = HymnConfig.getConfig().lyricLangs;

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
				validateHymnbookForm($scope.newHymnbookForm, $scope.newHymnbook);
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
					hymnbookToSave.lyricLangs = angular.copy($scope.newHymnbook.lyricLangs);
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
						},
						deleteMsg: function() {
							return '';
						}
					}
				});

				modalInstance.result.then(function (hymnbook) {
					hymnbook.$delete(function(response) {
						$scope.loadHymnbooks();
					});
				});
			};

			$scope.edit = function(hymnbook) {
				if (!$scope.publishersList) {
					$scope.publishersList = Publishers.query();
				}
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-edit-hymnbook.client.view.html',
					controller: 'EditItemController',
					windowClass: 'edit-item-modal',
					resolve: {
						itemToEdit: function () {
							return hymnbook;
						},
						selectLists: function() {
							return {
								publishers: $scope.publishersList
							};
						},
						checkboxItems: function() {
							return {
								lyricLangs: $scope.lyricLangs
							};
						},
						validateFn: function() {
							return validateHymnbookForm;
						}
					}
				});

				modalInstance.result.then(function (hymnbook) {
					hymnbook.$update(function(response) {
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
					lyricLangs: []
				};
			}

			function validateHymnbookForm(form, obj) {
				if (obj.names && !obj.names[0].name && !obj.names[1].name) {
					form.name.$setValidity('oneRequired', false);
				} else {
					form.name.$setValidity('oneRequired', true);
				}
			}

			resetNewHymnbookObj();	
		}])

	.controller('HymnsController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'Authentication', 'Publishers', 'Hymnbooks', 'Hymns', 'HymnConfig',
		function($scope, $state, $stateParams, $timeout, $modal, Authentication, Publishers, Hymnbooks, Hymns, HymnConfig) {
			$scope.currentState = $state.current;
			$scope.authentication = Authentication;

			$scope.show = {
				newSection: false
			};

			$scope.search = {
				langs: []
			};


			$scope.parentInfo = {
				parent: 'hymnbooks',
				child: 'hymns',
				title: 'Hymn Book'
			};

			$scope.lyricLangs = HymnConfig.getConfig().lyricLangs;

			$scope.loadHymns = function() {
				$scope.hymnbooksList = Hymnbooks.getAll();
				$scope.publishersList = Publishers.query();
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
				validateHymnForm($scope.newHymnForm, $scope.newHymn);
				if ($scope.newHymnForm.$valid) {
					var hymnToSave = new Hymns({
						hymnbookId: $stateParams.hymnbookId,
						names: [],
						lyricLangs: []
					});
					$scope.newHymn.names.forEach(function(elem) {
						if (elem.name) hymnToSave.names.push(elem);
					});
					hymnToSave.lyricLangs = angular.copy($scope.newHymn.lyricLangs);
					hymnToSave.hymnbookIndex = $scope.newHymn.hymnbookIndex;
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
						},
						deleteMsg: function() {
							return '';
						}
					}
				});

				modalInstance.result.then(function (hymn) {
					hymn.$delete(function(response) {
						$scope.loadHymns();
					});
				});
			};

			$scope.edit = function(hymn) {
				if (!$scope.publishersList) {
					$scope.publishersList = Publishers.query();
				}
				if (!$scope.hymnbooksList) {
					$scope.hymnbooksList = Hymnbooks.getAll();	
				}
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-edit-hymn.client.view.html',
					controller: 'EditItemController',
					windowClass: 'edit-item-modal',
					resolve: {
						itemToEdit: function () {
							return hymn;
						},
						selectLists: function() {
							return {
								hymnbooks: $scope.hymnbooksList
							};
						},
						checkboxItems: function() {
							return {
								lyricLangs: $scope.lyricLangs
							};
						},
						validateFn: function() {
							return validateHymnForm;
						}
					}
				});

				modalInstance.result.then(function (hymn) {
					hymn.$update(function(response) {
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
					lyricLangs: angular.copy($scope.parentInfo.obj.lyricLangs),
					hymnbookId: $stateParams.hymnbookId,
					publisherId: $scope.parentInfo.obj.publisher._id
				};
			}

			function validateHymnForm(form, obj) {
				if (!obj.names[0].name && !obj.names[1].name) {
					form.name.$setValidity('oneRequired', false);
				} else {
					form.name.$setValidity('oneRequired', true);
				}
			}

			$scope.$watchCollection('[hymnbooksList.$resolved, publishersList.$resolved, parentInfo.obj.$resolved]', 
				function(newValues) {
					if (_.all(newValues, _.identity)) {
						$timeout(function() {
							resetNewHymnObj();
						}, true);
					}
				});
		}])

	.controller('HymnController', ['$scope', '$state', '$stateParams', '$modal', 'Authentication', 'Publishers', 'Hymnbooks', 'Hymns', 'HymnConfig',
		function($scope, $state, $stateParams, $modal, Authentication, Publishers, Hymnbooks, Hymns, HymnConfig) {
			$scope.currentState = $state.current;
			$scope.authentication = Authentication;

			$scope.show = {
				addLyrics: false
			};

			$scope.newLyrics = {
				lyricLangs: []
			};

			$scope.newVerse = [];

			$scope.langsAvailable = [];

			$scope.lyricsVerseViewModel = [];

			$scope.addLyricsSet = function() {
				if ($scope.hymn.$resolved && $scope.newLyrics.lyricLangs.length > 0) {
					$scope.hymn.lyricsList.push({
						langs: angular.copy($scope.newLyrics.lyricLangs),
						lyrics: [],
						slideIndexes: []
					});
					$scope.hymn.$update(function(response) {
						$scope.loadHymn();
						resetNewLyrics();
					});
				}
			};

			$scope.parentInfo = {
				parent: 'hymnbooks',
				child: 'hymns',
				title: 'Hymn Book'
			};

			$scope.lyricLangs = HymnConfig.getConfig().lyricLangs;

			$scope.loadHymn = function() {
				$scope.hymn = Hymns.getOne({
					hymnId: $stateParams.hymnId
				});
			};

			$scope.addLabel = function(label) {
				if ($scope.hymn.labels.indexOf(label) === -1) {
					$scope.hymn.labels.push(label);
					$scope.hymn.$update(function(response) {
						$scope.newLabel = undefined;
						$scope.loadHymn();
					});
				}
			};

			$scope.removeLabel = function(label) {
				var labelIndex = $scope.hymn.labels.indexOf(label);
				if (labelIndex > -1) {
					$scope.hymn.labels.splice(labelIndex, 1);
					$scope.hymn.$update(function(response) {
						$scope.newLabel = undefined;
						$scope.loadHymn();
					});
				}
			};

			$scope.addLyricVerse = function(index) {
				if ($scope.newVerse[index]) {
					$scope.hymn.lyricsList[index].lyrics.push({
						verse: $scope.newVerse[index].verse,
						lines: convertLinesToModel($scope.newVerse[index].lines)
					});
					$scope.hymn.lyricsList[index].lyrics = _.sortBy($scope.hymn.lyricsList[index].lyrics, 'verse');
					$scope.hymn.$update(function(response) {
						if ($scope.lyricsVerseViewModel[index]) {
							$scope.lyricsVerseViewModel[index].push({
								verse: $scope.newVerse[index].verse,
								lines: $scope.newVerse[index].lines
							});
							$scope.lyricsVerseViewModel[index] = _.sortBy($scope.lyricsVerseViewModel[index], 'verse');
						}
						resetNewVerse(index);
					});
	
				}
			};

			$scope.cancelAddVerse = function(index) {
				resetNewVerse(index);
			};

			$scope.updateLyricVerse = function(lyricSet, verseViewModel, index) {
				if (lyricSet.lyrics && lyricSet.lyrics.length > index) {
					lyricSet.lyrics[index].verse = verseViewModel.verse;
					lyricSet.lyrics[index].lines = convertLinesToModel(verseViewModel.lines);
					$scope.hymn.$update(function(response) {
						verseViewModel.editMode = false;
					});
				}
			};

			$scope.cancelEditVerse = function(lyricSet, verseViewModel, index) {
				if (lyricSet.lyrics && lyricSet.lyrics.length > index) {
					verseViewModel.verse = lyricSet.lyrics[index].verse;
					verseViewModel.lines = convertLinesToView(lyricSet.lyrics[index].lines);
					verseViewModel.editMode = false;
				}
			};

			$scope.removeVerse = function(lyricSetIndex, verseIndex) {
				var modalInstance = $modal.open({
					templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
					controller: 'DeleteItemController',
					windowClass: 'delete-item-modal',
					resolve: {
						itemToDelete: function () {
							return {
								lyricSetIndex: lyricSetIndex,
								verseIndex: verseIndex
							};
						},
						deleteMsg: function() {
							return 'Confirm delete this verse?';
						}
					}
				});

				modalInstance.result.then(function (lyricsIndexObj) {
					if ($scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex] && 
						$scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex].lyrics.length > lyricsIndexObj.verseIndex && 
						$scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex] && 
						$scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex].length > lyricsIndexObj.verseIndex) {
						// console.log('removeVerse');
						// console.log($scope.hymn.lyricsList[lyricSetIndex].lyrics[verseIndex]);
						// console.log($scope.lyricsVerseViewModel[lyricSetIndex][verseIndex]);
						$scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex].lyrics.splice(lyricsIndexObj.verseIndex, 1);
						$scope.hymn.$update(function(response) {
							$scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex].splice(lyricsIndexObj.verseIndex, 1);
						});
					}
				});
			};


			function setLangsAvailable() {
				var lyricsListLangs = [];
				$scope.hymn.lyricsList.forEach(function(elem) {
					lyricsListLangs.push(elem.langs);
				});
				$scope.langsAvailable =  _.difference($scope.hymn.lyricLangs, _.flatten(lyricsListLangs)).sort();
			}

			function resetNewLyrics() {
				$scope.newLyrics = {
					lyricLangs: []
				};
			}

			function resetNewVerse(index) {
				$scope.newVerse[index] = { lines: [] };
			}

			function convertLinesToView(linesArray) {
				if (!_.isArray(linesArray)) return linesArray;

				return linesArray.join('\n');
			}

			function convertLinesToModel(linesString) {
				return linesString.split('\n');
			}

			function convertVerseToViewModel(verseObj) {
				return {
					verse: verseObj.verse,
					lines: convertLinesToView(verseObj.lines),
					editMode: false
				};
			}

			$scope.$watch('hymn.$resolved', function() {
				if ($scope.hymn.$resolved) {
					$scope.parentInfo.obj = $scope.hymn.hymnbook;
					$scope.hymn.lyricsList.forEach(function(elem, index) {
						var lyricsViewModel = [];
						if (elem.lyrics && elem.lyrics.length > 0) {
							elem.lyrics.forEach(function(elem, index) {
								lyricsViewModel.push(convertVerseToViewModel(elem));
							});
						}
						$scope.lyricsVerseViewModel.push(lyricsViewModel);
						$scope.newVerse.push({ lines: [] });
					});
					setLangsAvailable();
				}
			});

			resetNewLyrics();
		}])

	.controller('DeleteItemController', ['$scope', '$modalInstance', 'itemToDelete', 'deleteMsg', 
		function($scope, $modalInstance, itemToDelete, deleteMsg) {
			$scope.itemToDelete = itemToDelete;
			$scope.deleteMsg = deleteMsg;

			$scope.confirm = function() {
				$modalInstance.close($scope.itemToDelete);
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}])

	.controller('EditItemController', ['$scope', '$modalInstance', 'itemToEdit', 'selectLists', 'checkboxItems', 'validateFn', 
		function($scope, $modalInstance, itemToEdit, selectLists, checkboxItems, validateFn) {
			$scope.itemToEdit = itemToEdit;
			$scope.selectLists = selectLists;
			$scope.checkboxItems = checkboxItems;

			$scope.save = function(editForm) {
				validateFn(editForm, $scope.itemToEdit);
				if (editForm.$valid) {
					$modalInstance.close($scope.itemToEdit);	
				}
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}]);