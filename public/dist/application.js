'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.utils',
        'mm.foundation',
        'ui.select2',
        'ui.components',
        'ui.sortable'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('hymns');
angular.module('hymns').run([
  'uiSelect2Config',
  function (uiSelect2Config) {
    uiSelect2Config.allowClear = true;
  }
]);'use strict';
angular.module('ui.components', []);'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'link', '/articles', false, 'user');  //Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
                                                                                              //Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
                                                                                              //Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');  // Home state routing
                                        // $stateProvider.
                                        // state('home', {
                                        // 	url: '/',
                                        // 	templateUrl: 'modules/core/views/home.client.view.html'
                                        // });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'AuthService',
  'Menus',
  function ($scope, Authentication, AuthService, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    $scope.showUsersMenu = function () {
      return AuthService.hasAdminAuthorization($scope.authentication);
    };
    $scope.hasMasterAuthorization = function () {
      return AuthService.hasMasterAuthorization($scope.authentication);
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
angular.module('core').controller('MessageController', [
  '$scope',
  'NotifyService',
  function ($scope, NotifyService) {
    $scope.messages = NotifyService.messages;
    $scope.closeMessage = function (index) {
      NotifyService.removeMessageByIndex(index);
    };
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar', true);
  }]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('NotifyService', [function () {
    var notifyService = {
        messages: [],
        addMessage: function (id, type, message) {
          this.alerts.push({
            id: id,
            type: type,
            message: message
          });
          return this;
        },
        removeMessageById: function (id) {
          return this;
        },
        removeMessageByIndex: function (index) {
          return this;
        }
      };
    function findMessageById() {
    }
    function findMessageByIndex() {
    }
    return notifyService;
  }]);'use strict';
// Configuring the Articles module
angular.module('hymns').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Publishers', 'publishers', 'link', '/publishers', true);
    Menus.addMenuItem('topbar', 'Hymn Books', 'hymnbooks', 'link', '/hymnbooks', true);
  }
]);'use strict';
// Setting up route
angular.module('hymns').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Articles state routing
    $stateProvider.state('listPublishers', {
      url: '/publishers',
      templateUrl: 'modules/hymns/views/list-publishers.client.view.html'
    }).state('listHymnbooksInPublisher', {
      url: '/publishers/:publisherId/hymnbooks',
      templateUrl: 'modules/hymns/views/list-hymnbooks.client.view.html'
    }).state('listAllHymnBooks', {
      url: '/hymnbooks',
      templateUrl: 'modules/hymns/views/list-hymnbooks.client.view.html'
    }).state('listHymnsInHymnbook', {
      url: '/hymnbooks/:hymnbookId/hymns',
      templateUrl: 'modules/hymns/views/list-hymns.client.view.html'
    }).state('viewHymn', {
      url: '/hymns/:hymnId',
      templateUrl: 'modules/hymns/views/view-hymn.client.view.html'
    });
    $urlRouterProvider.otherwise('/hymnbooks');
  }
]);'use strict';
angular.module('hymns').controller('PublishersController', [
  '$scope',
  '$modal',
  'Authentication',
  'AuthService',
  'Publishers',
  function ($scope, $modal, Authentication, AuthService, Publishers) {
    $scope.authentication = Authentication;
    $scope.show = { newSection: false };
    $scope.loadPublishers = function () {
      $scope.publishers = Publishers.query();
    };
    $scope.createPublisher = function () {
      validatePublisherForm($scope.newPublisherForm, $scope.newPublisher);
      if ($scope.newPublisherForm.$valid) {
        var publisherToSave = new Publishers({ names: [] });
        $scope.newPublisher.names.forEach(function (elem) {
          if (elem.name !== undefined)
            publisherToSave.names.push(elem);
        });
        publisherToSave.$save(function (response) {
          resetNewPublisherList();
          $scope.loadPublishers();
          $scope.show.newSection = false;
        }, function (response) {
        });
      }
    };
    $scope.delete = function (publisher) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
          controller: 'DeleteItemController',
          windowClass: 'delete-item-modal',
          resolve: {
            itemToDelete: function () {
              return publisher;
            },
            deleteMsg: function () {
              return '';
            }
          }
        });
      modalInstance.result.then(function (publisher) {
        publisher.$delete(function (response) {
          $scope.loadPublishers();
        });
      });
    };
    $scope.edit = function (publisher) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/hymns/views/modal-edit-publisher.client.view.html',
          controller: 'EditItemController',
          windowClass: 'edit-item-modal',
          resolve: {
            itemToEdit: function () {
              return publisher;
            },
            selectLists: function () {
              return {};
            },
            checkboxItems: function () {
              return {};
            },
            validateFn: function () {
              return validatePublisherForm;
            }
          }
        });
      modalInstance.result.then(function (publisher) {
        publisher.$update(function (response) {
          $scope.loadPublishers();
        });
      });
    };
    $scope.cancelNew = function () {
      $scope.show.newSection = false;
      resetNewPublisherList();
    };
    $scope.hasWriteAuthorization = function (item) {
      return AuthService.hasWriteAuthorization($scope.authentication, item);
    };
    function resetNewPublisherList() {
      $scope.newPublisher = {
        names: [
          {
            lang: 'zh',
            name: ''
          },
          {
            lang: 'en',
            name: ''
          }
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
  }
]).controller('HymnbooksController', [
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$modal',
  'Authentication',
  'AuthService',
  'Publishers',
  'Hymnbooks',
  'HymnConfig',
  function ($scope, $state, $stateParams, $timeout, $modal, Authentication, AuthService, Publishers, Hymnbooks, HymnConfig) {
    $scope.currentState = $state.current;
    $scope.authentication = Authentication;
    $scope.show = {
      newSection: false,
      filterSection: false
    };
    $scope.search = { langs: [] };
    $scope.parentInfo = {
      parent: 'publishers',
      child: 'hymnbooks',
      title: 'Publisher'
    };
    $scope.lyricLangs = HymnConfig.getConfig().lyricLangs;
    $scope.loadHymnbooks = function () {
      if ($scope.currentState.name === 'listHymnbooksInPublisher') {
        $scope.parentInfo.obj = Publishers.get({ publisherId: $stateParams.publisherId });
        $scope.hymnbooks = Hymnbooks.query({ publisherId: $stateParams.publisherId });
      } else {
        $scope.hymnbooks = Hymnbooks.getAll();
        $scope.unknownHymnbook = Hymnbooks.getUnknownHymnbook();
        $scope.publishersList = Publishers.query();
      }
    };
    $scope.createHymnbook = function () {
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
        $scope.newHymnbook.names.forEach(function (elem) {
          if (elem.name !== undefined)
            hymnbookToSave.names.push(elem);
        });
        if ($scope.newHymnbook.year) {
          hymnbookToSave.year = $scope.newHymnbook.year;
        }
        hymnbookToSave.lyricLangs = angular.copy($scope.newHymnbook.lyricLangs);
        if ($stateParams.publisherId || $scope.newHymnbook.publisherId) {
          hymnbookToSave.$save(function (response) {
            resetNewHymnbookObj();
            $scope.loadHymnbooks();
            $scope.show.newSection = false;
          }, function (response) {
          });
        } else {
          hymnbookToSave.$saveWithNoPublisher(function (response) {
            resetNewHymnbookObj();
            $scope.loadHymnbooks();
            $scope.show.newSection = false;
          }, function (response) {
          });
        }
      }
    };
    $scope.delete = function (hymnbook) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
          controller: 'DeleteItemController',
          windowClass: 'delete-item-modal',
          resolve: {
            itemToDelete: function () {
              return hymnbook;
            },
            deleteMsg: function () {
              return '';
            }
          }
        });
      modalInstance.result.then(function (hymnbook) {
        hymnbook.$delete(function (response) {
          $scope.loadHymnbooks();
        });
      });
    };
    $scope.edit = function (hymnbook) {
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
            selectLists: function () {
              return { publishers: $scope.publishersList };
            },
            checkboxItems: function () {
              return { lyricLangs: $scope.lyricLangs };
            },
            validateFn: function () {
              return validateHymnbookForm;
            }
          }
        });
      modalInstance.result.then(function (hymnbook) {
        hymnbook.$update(function (response) {
          $scope.loadHymnbooks();
        });
      });
    };
    $scope.cancelNew = function () {
      $scope.show.newSection = false;
      resetNewHymnbookObj();
    };
    $scope.hasWriteAuthorization = function (item) {
      return AuthService.hasWriteAuthorization($scope.authentication, item);
    };
    function resetNewHymnbookObj() {
      $scope.newHymnbook = {
        names: [
          {
            lang: 'zh',
            name: ''
          },
          {
            lang: 'en',
            name: ''
          }
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
  }
]).controller('HymnsController', [
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$modal',
  'Authentication',
  'AuthService',
  'Publishers',
  'Hymnbooks',
  'Hymns',
  'HymnConfig',
  function ($scope, $state, $stateParams, $timeout, $modal, Authentication, AuthService, Publishers, Hymnbooks, Hymns, HymnConfig) {
    $scope.currentState = $state.current;
    $scope.authentication = Authentication;
    $scope.show = { newSection: false };
    $scope.search = { langs: [] };
    $scope.parentInfo = {
      parent: 'hymnbooks',
      child: 'hymns',
      title: 'Hymn Book'
    };
    $scope.lyricLangs = HymnConfig.getConfig().lyricLangs;
    $scope.loadHymns = function () {
      $scope.hymnbooksList = Hymnbooks.getAll();
      $scope.publishersList = Publishers.query();
      if ($scope.currentState.name === 'listHymnsInHymnbook') {
        $scope.parentInfo.obj = Hymnbooks.getOne({ hymnbookId: $stateParams.hymnbookId });
        $scope.hymns = Hymns.query({ hymnbookId: $stateParams.hymnbookId });
      }
    };
    $scope.createHymn = function () {
      validateHymnForm($scope.newHymnForm, $scope.newHymn);
      if ($scope.newHymnForm.$valid) {
        var hymnToSave = new Hymns({
            names: [],
            lyricLangs: []
          });
        if ($scope.newHymn.hymnbookId) {
          hymnToSave.hymnbookId = $scope.newHymn.hymnbookId;
        } else {
          hymnToSave.hymnbookId = 'unknown';
        }
        $scope.newHymn.names.forEach(function (elem) {
          if (elem.name !== undefined)
            hymnToSave.names.push(elem);
        });
        hymnToSave.lyricLangs = angular.copy($scope.newHymn.lyricLangs);
        hymnToSave.hymnbookIndex = $scope.newHymn.hymnbookIndex;
        hymnToSave.$save(function (response) {
          resetNewHymnObj();
          $scope.loadHymns();
          $scope.show.newSection = false;
        }, function (response) {
        });
      }
    };
    $scope.delete = function (hymn) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
          controller: 'DeleteItemController',
          windowClass: 'delete-item-modal',
          resolve: {
            itemToDelete: function () {
              return hymn;
            },
            deleteMsg: function () {
              return '';
            }
          }
        });
      modalInstance.result.then(function (hymn) {
        hymn.$delete(function (response) {
          $scope.loadHymns();
        });
      });
    };
    $scope.edit = function (hymn) {
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
            selectLists: function () {
              return { hymnbooks: $scope.hymnbooksList };
            },
            checkboxItems: function () {
              return { lyricLangs: $scope.lyricLangs };
            },
            validateFn: function () {
              return validateHymnForm;
            }
          }
        });
      modalInstance.result.then(function (hymn) {
        hymn.$update(function (response) {
          $scope.loadHymns();
        });
      });
    };
    $scope.cancelNew = function () {
      $scope.show.newSection = false;
      resetNewHymnObj();
    };
    $scope.hasWriteAuthorization = function (item) {
      return AuthService.hasWriteAuthorization($scope.authentication, item);
    };
    function resetNewHymnObj() {
      $scope.newHymn = {
        names: [
          {
            lang: 'zh',
            name: ''
          },
          {
            lang: 'en',
            name: ''
          }
        ],
        lyricLangs: []
      };
      if ($stateParams.hymnbookId && $stateParams.hymnbookId !== 'unknown') {
        $scope.newHymn.hymnbookId = $stateParams.hymnbookId;
        $scope.newHymn.publisherId = $scope.parentInfo.obj.publisher._id;
        $scope.newHymn.lyricLangs = angular.copy($scope.parentInfo.obj.lyricLangs);
      }
    }
    function validateHymnForm(form, obj) {
      if (!obj.names[0].name && !obj.names[1].name) {
        form.name.$setValidity('oneRequired', false);
      } else {
        form.name.$setValidity('oneRequired', true);
      }
    }
    $scope.$watchCollection('[hymnbooksList.$resolved, publishersList.$resolved, parentInfo.obj.$resolved]', function (newValues) {
      if (_.all(newValues, _.identity)) {
        $timeout(function () {
          resetNewHymnObj();
        }, true);
      }
    });
  }
]).controller('HymnController', [
  '$scope',
  '$state',
  '$stateParams',
  '$modal',
  'Authentication',
  'AuthService',
  'Publishers',
  'Hymnbooks',
  'Hymns',
  'HymnConfig',
  'HymnClipboard',
  function ($scope, $state, $stateParams, $modal, Authentication, AuthService, Publishers, Hymnbooks, Hymns, HymnConfig, HymnClipboard) {
    var selectedTab = 0;
    $scope.currentState = $state.current;
    $scope.authentication = Authentication;
    $scope.show = { addLyrics: false };
    $scope.newLyrics = { lyricLangs: [] };
    $scope.newVerse = [];
    $scope.langsAvailable = [];
    $scope.lyricsVerseViewModel = [];
    $scope.addLyricsSet = function () {
      if ($scope.hymn.$resolved && $scope.newLyrics.lyricLangs.length > 0) {
        $scope.hymn.lyricsList.push({
          langs: angular.copy($scope.newLyrics.lyricLangs),
          lyrics: [],
          slideIndexes: []
        });
        $scope.hymn.$update(function (response) {
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
    $scope.loadHymn = function () {
      $scope.hymn = Hymns.getOne({ hymnId: $stateParams.hymnId });
      $scope.allLabels = Hymns.allLabels();
    };
    $scope.addLabel = function (label) {
      if ($scope.hymn.labels.indexOf(label) === -1) {
        $scope.hymn.labels.push(label);
        $scope.hymn.$update(function (response) {
        });
      }
      $scope.newLabel = '';
    };
    $scope.removeLabel = function (label) {
      var labelIndex = $scope.hymn.labels.indexOf(label);
      if (labelIndex > -1) {
        $scope.hymn.labels.splice(labelIndex, 1);
        $scope.hymn.$update(function (response) {
          $scope.newLabel = undefined;
          $scope.loadHymn();
        });
      }
    };
    $scope.addLyricVerse = function (index) {
      if ($scope.newVerse[index]) {
        $scope.hymn.lyricsList[index].lyrics.push({
          verse: $scope.newVerse[index].verse,
          lines: convertLinesToModel($scope.newVerse[index].lines)
        });
        $scope.hymn.lyricsList[index].lyrics = _.sortBy($scope.hymn.lyricsList[index].lyrics, 'verse');
        $scope.hymn.$update(function (response) {
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
    $scope.cancelAddVerse = function (index) {
      resetNewVerse(index);
    };
    $scope.updateLyricVerse = function (lyricSetIndex, verseIndex) {
      var lyricSet = $scope.hymn.lyricsList[lyricSetIndex];
      var verseViewModel = $scope.lyricsVerseViewModel[lyricSetIndex][verseIndex];
      if (lyricSet.lyrics && lyricSet.lyrics.length > verseIndex) {
        lyricSet.lyrics[verseIndex].verse = verseViewModel.verse;
        lyricSet.lyrics[verseIndex].lines = convertLinesToModel(verseViewModel.lines);
        $scope.hymn.$update(function (response) {
          verseViewModel.editMode = false;
        });
      }
    };
    $scope.cancelEditVerse = function (lyricSet, verseViewModel, index) {
      if (lyricSet.lyrics && lyricSet.lyrics.length > index) {
        verseViewModel.verse = lyricSet.lyrics[index].verse;
        verseViewModel.lines = convertLinesToView(lyricSet.lyrics[index].lines);
        verseViewModel.editMode = false;
      }
    };
    $scope.removeVerse = function (lyricSetIndex, verseIndex) {
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
            deleteMsg: function () {
              return 'Confirm delete this verse?';
            }
          }
        });
      modalInstance.result.then(function (lyricsIndexObj) {
        if ($scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex] && $scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex].lyrics.length > lyricsIndexObj.verseIndex && $scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex] && $scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex].length > lyricsIndexObj.verseIndex) {
          $scope.hymn.lyricsList[lyricsIndexObj.lyricSetIndex].lyrics.splice(lyricsIndexObj.verseIndex, 1);
          $scope.hymn.$update(function (response) {
            $scope.lyricsVerseViewModel[lyricsIndexObj.lyricSetIndex].splice(lyricsIndexObj.verseIndex, 1);
          });
        }
      });
    };
    $scope.setHymnClipboard = function (lyricSetIndex, verseIndex) {
      if ($scope.lyricsVerseViewModel[lyricSetIndex] && $scope.lyricsVerseViewModel[lyricSetIndex].length > verseIndex) {
        HymnClipboard.set($scope.lyricsVerseViewModel[lyricSetIndex][verseIndex].lines);
      }
    };
    $scope.onStartDrag = function () {
      $scope.startDrag = true;
    };
    $scope.onStopDrag = function () {
      $scope.startDrag = false;
    };
    $scope.hasAuthorization = function (item) {
      return $scope.authentication.user && $scope.authentication.user._id === item.user._id;
    };
    $scope.hasWriteAuthorization = function (item) {
      return AuthService.hasWriteAuthorization($scope.authentication, item);
    };
    $scope.updateSelectedTab = function () {
      $scope.verseIndexSelected = -1;
      $scope.hymn.lyricsList.forEach(function (elem, index) {
        if (elem.active) {
          selectedTab = index;
          return;
        }
      });
    };
    $scope.saveHymn = function () {
      $scope.hymn.$update(function (response) {
      });
    };
    $scope.selectVerseFromArrangement = function (indexFromArrangement) {
      if ($scope.verseIndexSelected === indexFromArrangement) {
        $scope.verseIndexSelected = -1;
      } else {
        $scope.verseIndexSelected = indexFromArrangement;
      }
    };
    $scope.removeVerseFromArrangement = function () {
      if ($scope.hymn.defaultArrangement.length > $scope.verseIndexSelected) {
        $scope.hymn.defaultArrangement.splice($scope.verseIndexSelected, 1);
      }
      $scope.saveHymn();
    };
    $scope.addVerseToArrangement = function (verse) {
      $scope.hymn.defaultArrangement.push(verse);
      $scope.saveHymn();
    };
    $scope.defaultArrangementSortableOptions = {
      update: function (e, ui) {
        $scope.saveHymn();
      }
    };
    function setLangsAvailable() {
      var lyricsListLangs = [];
      $scope.hymn.lyricsList.forEach(function (elem) {
        lyricsListLangs.push(elem.langs);
      });
      $scope.langsAvailable = _.difference($scope.hymn.lyricLangs, _.flatten(lyricsListLangs)).sort();
    }
    function resetNewLyrics() {
      $scope.newLyrics = { lyricLangs: [] };
    }
    function resetNewVerse(index) {
      $scope.newVerse[index] = { lines: [] };
    }
    function convertLinesToView(linesArray) {
      if (!_.isArray(linesArray))
        return linesArray;
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
    $scope.$watch('hymn.$resolved', function () {
      if ($scope.hymn.$resolved) {
        $scope.parentInfo.obj = $scope.hymn.hymnbook;
        $scope.hymn.lyricsList.forEach(function (elem, index) {
          var lyricsViewModel = [];
          if (elem.lyrics && elem.lyrics.length > 0) {
            elem.lyrics.forEach(function (elem, index) {
              lyricsViewModel.push(convertVerseToViewModel(elem));
            });
          }
          $scope.lyricsVerseViewModel.push(lyricsViewModel);
          $scope.newVerse.push({ lines: [] });
        });
        setLangsAvailable();
      }
    });
    $scope.$watch('hymn', function () {
      if (selectedTab > 0) {
        if ($scope.hymn.lyricsList && $scope.hymn.lyricsList.length > selectedTab) {
          $scope.hymn.lyricsList[selectedTab].active = true;
        }
      }
    }, true);
    resetNewLyrics();
  }
]).controller('DeleteItemController', [
  '$scope',
  '$modalInstance',
  'itemToDelete',
  'deleteMsg',
  function ($scope, $modalInstance, itemToDelete, deleteMsg) {
    $scope.itemToDelete = itemToDelete;
    $scope.deleteMsg = deleteMsg;
    $scope.confirm = function () {
      $modalInstance.close($scope.itemToDelete);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]).controller('EditItemController', [
  '$scope',
  '$modalInstance',
  'itemToEdit',
  'selectLists',
  'checkboxItems',
  'validateFn',
  function ($scope, $modalInstance, itemToEdit, selectLists, checkboxItems, validateFn) {
    $scope.itemToEdit = itemToEdit;
    $scope.selectLists = selectLists;
    $scope.checkboxItems = checkboxItems;
    $scope.save = function (editForm) {
      validateFn(editForm, $scope.itemToEdit);
      if (editForm.$valid) {
        $modalInstance.close($scope.itemToEdit);
      }
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);'use strict';
angular.module('hymns').directive('hymnCopyClipboard', [
  'HymnClipboard',
  function (HymnClipboard) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        $(document).on('keydown', function (event) {
          var clipValue = HymnClipboard.get();
          if (!clipValue || !(event.ctrlKey || event.metaKey))
            return;
          if ($(event.target).is('input:visible,textarea:visible'))
            return;
          //if (window.getSelection().toString()) return;
          _.defer(function () {
            var $clipboardContainer = $('#lyrics-clipboard-container');
            $clipboardContainer.empty().show();
            $('<textarea id="clipboard"></textarea>').val(clipValue).appendTo($clipboardContainer).focus().select();
          });
        });
        $(document).on('keyup', function (event) {
          if ($(event.target).is('#clipboard'))
            $('#lyrics-clipboard-container').empty().hide();
        });
      }
    };
  }
]).directive('hymnZeroClipboard', [function () {
    return {
      retrict: 'A',
      link: function (scope, elem, attrs) {
        var clip = new ZeroClipboard(elem);
      }
    };
  }]).directive('listEntryExpand', [
  '$window',
  function ($window) {
    return {
      link: function (scope, elem, attrs) {
        angular.element($window).bind('resize', function () {
          adjustWidth();
          setLeftOffsetPos();
          scope.$apply();
        });
        function adjustWidth() {
          var w = window.innerWidth - 95;
          elem.css('width', window.innerWidth + 'px');
        }
        function setLeftOffsetPos() {
          // Remove left style first?
          elem.css('left', -Math.abs(elem.offset().left));
        }
        adjustWidth();
        setLeftOffsetPos();
      }
    };
  }
]);'use strict';
angular.module('hymns').filter('lyricLangsCssClass', function () {
  return function (array) {
    if (!_.isArray(array))
      return '';
    return array.toString().replace(/,/g, ' ');
  };
}).filter('concatNames', function () {
  return function (names) {
    var fullName = '';
    if (_.isArray(names)) {
      names.forEach(function (elem, index) {
        if (index > 0 && elem.name)
          fullName = fullName.concat(' - ');
        fullName = fullName.concat(elem.name);
      });
    }
    return fullName;
  };
}).filter('displayLangs', function () {
  return function (langs) {
    if (!_.isArray(langs))
      return langs;
    var displayLangs = '';
    langs.forEach(function (elem, index) {
      if (index > 0 && elem !== undefined)
        displayLangs = displayLangs.concat(' - ');
      switch (elem) {
      case 'en':
        displayLangs = displayLangs.concat('English');
        break;
      case 'zh-CAN':
        displayLangs = displayLangs.concat('\u7cb5\u8a9e');
        break;
      case 'zh-MAN':
        displayLangs = displayLangs.concat('\u570b\u8a9e');
        break;
      }
    });
    return displayLangs;
  };
}).filter('filterHymnOrHymnbook', function () {
  return function (array, searchObj) {
    if (!_.isArray(array))
      return array;
    if (!searchObj)
      return array;
    if (!searchObj.name && !searchObj.publisherId && !searchObj.hymnbookId && searchObj.langs.length === 0)
      return array;
    var matchedArray = [];
    array.forEach(function (elem) {
      var matched = true;
      if (searchObj.name && elem.names && _.isArray(elem.names)) {
        var nameMatched = false;
        elem.names.forEach(function (nameObj) {
          if (nameObj.name.toLowerCase().indexOf(searchObj.name.toLowerCase()) > -1)
            nameMatched = true;
        });
        matched = nameMatched;
      }
      if (searchObj.publisherId && elem.publisher && elem.publisher._id) {
        if (elem.publisher._id !== searchObj.publisherId)
          matched = false;
      } else if (searchObj.publisherId && !elem.publisher) {
        matched = false;
      }
      if (searchObj.hymnbookId && elem.hymnbook && elem.hymnbook._id) {
        if (elem.hymnbook._id !== searchObj.hymnbookId)
          matched = false;
      } else if (searchObj.hymnbookId && !elem.hymnbook) {
        matched = false;
      }
      if (searchObj.langs.length !== _.intersection(searchObj.langs, elem.lyricLangs).length)
        matched = false;
      if (matched)
        matchedArray.push(elem);
    });
    return matchedArray;
  };
});'use strict';
// hymns service used for communicating with the REST endpoints
angular.module('hymns').factory('Publishers', [
  '$resource',
  function ($resource) {
    return $resource('publishers/:publisherId', { publisherId: '@_id' }, {
      update: { method: 'PUT' },
      getHymnbooksCount: {
        method: 'GET',
        url: 'publishers/:publisherId/hymbooksCount'
      }
    });
  }
]).factory('Hymnbooks', [
  '$resource',
  function ($resource) {
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
]).factory('Hymns', [
  '$resource',
  function ($resource) {
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
]).factory('HymnConfig', [function () {
    var config = {
        lyricLangs: {
          values: [
            'en',
            'zh-CAN',
            'zh-MAN'
          ],
          displayNames: {
            'en': 'English',
            'zh-CAN': 'Cantonese',
            'zh-MAN': 'Mandarin'
          }
        }
      };
    return {
      getConfig: function () {
        return config;
      }
    };
  }]).factory('HymnClipboard', [function () {
    var clipValue = '';
    return {
      get: function () {
        return clipValue;
      },
      set: function (value) {
        clipValue = value;
      }
    };
  }]);'use strict';
angular.module('ui.components').directive('uiToggleBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uiToggleBtnValue: '=',
      uiToggleBtnLabel: '@'
    },
    template: '<div class="ui-toggle">' + '<div class="ui-toggle-btn" ng-class="{on: uiToggleBtnValue, off: !uiToggleBtnValue}" ng-click="uiToggleBtnValue=!uiToggleBtnValue">' + '<div class="toggler"></div>' + '</div>' + '<div class="ui-toggle-label">{{uiToggleBtnLabel}}</div>' + '</div>'
  };
}).directive('uiGroupCheckbox', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uiGroupCheckboxCssClass: '@',
      uiGroupCheckboxModel: '=',
      uiGroupCheckboxValues: '=',
      uiGroupCheckboxLabels: '='
    },
    template: '<div class="ui-group-checkbox {{uiGroupCheckboxCssClass}}">' + '<div class="ui-checkbox" ng-repeat="item in uiGroupCheckboxValues track by $index">' + '<span class="fa-stack" ng-click="select(item)">' + '<i class="fa fa-circle-thin fa-stack-2x" ng-class="{checked: isChecked(item)}"></i>' + '<i class="fa fa-check fa-stack-1x" ng-show="isChecked(item)"></i>' + '</span>' + '<div class="ui-group-checkbox-label" ng-click="select(item)">{{uiGroupCheckboxLabels[item]}}</div>' + '</div>' + '</div>',
    link: function (scope, elem, attrs) {
      scope.isChecked = function (item) {
        return _.isArray(scope.uiGroupCheckboxModel) && scope.uiGroupCheckboxModel.indexOf(item) > -1;
      };
      scope.select = function (item) {
        if (_.isArray(scope.uiGroupCheckboxModel)) {
          var itemIndex = scope.uiGroupCheckboxModel.indexOf(item);
          if (itemIndex === -1) {
            scope.uiGroupCheckboxModel.push(item);
          } else {
            scope.uiGroupCheckboxModel.splice(itemIndex, 1);
          }
        }
      };
    }
  };
}).directive('uiIconBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uiIconBtnIconClass: '@',
      uiIconBtnCssClass: '@',
      uiIconBtnClass: '@',
      uiIconBtnOnClick: '&',
      uiIconBtnTooltip: '@',
      uiIconBtnTooltipPlacement: '@'
    },
    template: '<div class="ui-icon-btn {{uiIconBtnCssClass}}" ng-click="uiIconBtnOnClick()">' + '<span class="fa-stack {{uiIconBtnClass}}" tooltip="{{uiIconBtnTooltip}}" tooltip-placement="{{uiIconBtnTooltipPlacement}}">' + '<i class="fa fa-circle-thin fa-stack-2x"></i>' + '<i class="fa fa-{{uiIconBtnIconClass}} fa-stack-1x"></i>' + '</span>' + '</div>'
  };
}).directive('uiBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uiBtnType: '@',
      uiBtnIconClass: '@',
      uiBtnLabel: '@',
      uiBtnCssClass: '@',
      uiBtnBtnCssClass: '@',
      uiBtnOnClick: '&',
      uiBtnTooltip: '@',
      uiBtnTooltipPlacement: '@'
    },
    template: '<div class="ui-btn {{uiBtnCssClass}}">' + '<button type="{{uiBtnType}}" class="{{uiBtnBtnCssClass}}" ng-click="uiBtnOnClick()" ' + 'tooltip="{{uiBtnTooltip}}" tooltip-placement="{{uiBtnTooltipPlacement}}">' + '<i class="fa fa-{{uiBtnIconClass}}" ng-show="uiBtnIconClass"/> {{uiBtnLabel}}' + '</button>' + '</div>'
  };
});'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('addUser', {
      url: '/users/add',
      templateUrl: 'modules/users/views/authentication/create-user.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    }).state('manageOrgs', {
      url: '/orgs',
      templateUrl: 'modules/users/views/orgs/manage-orgs.client.view.html'
    }).state('listUsers', {
      url: '/users',
      templateUrl: 'modules/users/views/settings/list-users.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('SigninController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]).controller('AddUserController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  'Orgs',
  'UserUtil',
  function ($scope, $http, $location, Authentication, Orgs, UserUtil) {
    $scope.authentication = Authentication;
    $scope.credentials = { roles: [] };
    $scope.orgs = [];
    function allowAddUser() {
      return $scope.authentication.user && (_.indexOf($scope.authentication.user.roles, 'admin') > -1 || _.indexOf($scope.authentication.user.roles, 'master') > -1);
    }
    // If user is signed in then redirect back home
    if ($scope.authentication.user && !allowAddUser())
      $location.path('/');
    if (_.indexOf($scope.authentication.user.roles, 'master') > -1) {
      $scope.orgs = Orgs.query();
    } else {
      $scope.credentials.orgId = $scope.authentication.user.org;
    }
    $scope.availableRoles = UserUtil.getRoles($scope.authentication.user.roles);
    $scope.addUser = function () {
      // TO-DO: validation
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.showRolesCheckbox = function () {
      return $scope.authentication.user && $scope.authentication.user.roles && ($scope.authentication.user.roles.indexOf('admin') > -1 || $scope.authentication.user.roles.indexOf('master') > -1);
    };
  }
]);'use strict';
angular.module('users').controller('OrgsController', [
  '$scope',
  '$location',
  '$modal',
  'Orgs',
  'Authentication',
  'AuthService',
  function ($scope, $location, $modal, Orgs, Authentication, AuthService) {
    $scope.authentication = Authentication;
    // If user is not signed in or not master role then redirect back home
    if (!$scope.authentication.user || !AuthService.hasMasterAuthorization($scope.authentication))
      $location.path('/');
    $scope.show = { newSection: false };
    $scope.loadOrgs = function () {
      $scope.orgs = Orgs.query();
    };
    $scope.createOrg = function () {
      validateOrgForm($scope.newOrgForm, $scope.newOrg);
      if ($scope.newOrgForm.$valid) {
        var orgToSave = new Orgs({
            orgCode: $scope.newOrg.orgCode,
            fullName: $scope.newOrg.fullName
          });
        orgToSave.$save(function (response) {
          resetNewOrgList();
          $scope.loadOrgs();
          $scope.show.newSection = false;
        }, function (response) {
        });
      }
    };
    $scope.delete = function (org) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/hymns/views/modal-delete-item.client.view.html',
          controller: 'DeleteItemController',
          windowClass: 'delete-item-modal',
          resolve: {
            itemToDelete: function () {
              return org;
            },
            deleteMsg: function () {
              return 'Confirm Delete Org?';
            }
          }
        });
      modalInstance.result.then(function (org) {
        org.$delete(function (response) {
          $scope.loadOrgs();
        });
      });
    };
    $scope.cancelNew = function () {
      $scope.show.newSection = false;
      resetNewOrgList();
    };
    $scope.saveOrg = function (org) {
      org.$update(function (response) {
      });
    };
    $scope.hasWriteAuthorization = function (item) {
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
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  'UserUtil',
  function ($scope, $http, $location, Users, Authentication, UserUtil) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    $scope.availableRoles = UserUtil.getRoles($scope.user.roles);
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    $scope.hasAdminAuthentication = function () {
      return $scope.user && (_.indexOf($scope.user.roles, 'admin') > -1 || _.indexOf($scope.user.roles, 'master') > -1);
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]).controller('UsersController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  'AuthService',
  'UserUtil',
  function ($scope, $http, $location, Users, Authentication, AuthService, UserUtil) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user)
      $location.path('/');
    $scope.availableRoles = UserUtil.getRoles($scope.authentication.user.roles);
    // Get all users for master
    // Get only users in org for admin
    // Redirect to home if not master and admin
    if (AuthService.hasMasterAuthorization($scope.authentication)) {
      $scope.users = Users.query();
    } else if (AuthService.hasAdminAuthorization($scope.authentication) && $scope.authentication.user.org) {
      $scope.users = Users.getUsersInOrg({ orgId: $scope.authentication.user.org });
    } else {
      $location.path('/');
    }
    $scope.hasAdminAuthentication = function () {
      return AuthService.hasAdminAuthorization($scope.authentication);
    };
    $scope.toggleEditSection = function (user) {
      user.editShow = !user.editShow;
      if (user.editShow) {
        closeOthers(user);
      }
    };
    $scope.saveUser = function (user) {
      user.$updateOneUser({ userId: user._id }, function (response) {
        $scope.success = true;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    function closeOthers(user) {
      $scope.users.forEach(function (u) {
        if (u._id !== user._id && u.editShow) {
          u.editShow = false;
        }
      });
    }
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]).factory('AuthService', [function () {
    return {
      hasWriteAuthorization: function (auth, item) {
        return auth.user && (auth.user._id === item.user._id || this.hasAdminAuthorization(auth));
      },
      hasAdminAuthorization: function (auth) {
        return auth.user && (_.indexOf(auth.user.roles, 'admin') > -1 || _.indexOf(auth.user.roles, 'master') > -1);
      },
      hasMasterAuthorization: function (auth) {
        return auth.user && _.indexOf(auth.user.roles, 'master') > -1;
      }
    };
  }]);'use strict';
// Orgs service used for communicating with the orgs REST endpoint
angular.module('users').factory('Orgs', [
  '$resource',
  function ($resource) {
    return $resource('orgs/:orgId', { orgId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, {
      update: { method: 'PUT' },
      getUsersInOrg: {
        method: 'GET',
        url: 'orgs/:orgId/users',
        isArray: true
      },
      updateOneUser: {
        method: 'PUT',
        url: 'users/:userId'
      }
    });
  }
]).factory('UserUtil', [function () {
    var roles = {
        'user': 'User',
        'admin': 'Admin',
        'master': 'Master'
      };
    return {
      getRoles: function (currentUserRoles) {
        var roles = {
            values: [],
            displayName: {}
          };
        if (!_.isArray(currentUserRoles))
          return roles;
        if (_.indexOf(currentUserRoles, 'admin') > -1 || _.indexOf(currentUserRoles, 'master') > -1) {
          roles.values.push('user');
          roles.displayName.user = 'User';
          roles.values.push('admin');
          roles.displayName.admin = 'Admin';
        }
        if (_.indexOf(currentUserRoles, 'master') > -1) {
          roles.values.push('master');
          roles.displayName.master = 'Master';
        }
        return roles;
      }
    };
  }]);