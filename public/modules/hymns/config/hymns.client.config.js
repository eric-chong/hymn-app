'use strict';

// Configuring the Articles module
angular.module('hymns').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Publishers', 'publishers', 'link', '/publishers', true);
		Menus.addMenuItem('topbar', 'Hymn Books', 'hymnbooks', 'link', '/hymnbooks', true);
	}
]);