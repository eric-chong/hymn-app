'use strict';

//Menu service used for managing  menus
angular.module('core').service('NotifyService', [function() {
	var notifyService = {
		messages: [
			{id: 'message1', type: 'success', message: 'Success Message'},
			{id: 'message2', type: 'alert', message: 'Alert Message'},
			{id: 'message3', type: 'warning', message: 'Warning Message'}
		],

		addMessage: function(id, type, message) {
			this.alerts.push({
				id: id,
				type: type,
				message: message
			});
			return this;
		},

		removeMessageById: function(id) {
			return this;
		},

		removeMessageByIndex: function(index) {
			return this;
		}
	};

	function findMessageById() {

	}

	function findMessageByIndex() {

	}

	return notifyService;
}]);