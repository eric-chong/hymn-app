'use strict';

angular.module('core').controller('MessageController', ['$scope', 'NotifyService',
	function($scope, NotifyService) {
		$scope.messages = NotifyService.messages;

		$scope.closeMessage = function(index) {
			NotifyService.removeMessageByIndex(index);
		};
  	}
]);