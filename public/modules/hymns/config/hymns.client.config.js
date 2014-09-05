'use strict';

// Configuring the Articles module
angular.module('hymns').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Articles', 'articles', 'link', '/articles', false, 'user');
		//Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		//Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		//Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);