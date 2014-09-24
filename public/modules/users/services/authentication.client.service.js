'use strict';

// Authentication service for user variables
angular.module('users')

	.factory('Authentication', [
		function() {
			var _this = this;

			_this._data = {
				user: window.user
			};

			return _this._data;
		}
	])

	.factory('AuthService', [
		function() {
			return {
				hasWriteAuthorization: function(auth, item) {
					return auth.user && (auth.user._id === item.user._id || this.hasAdminAuthorization(auth));
				},
				hasAdminAuthorization: function(auth) {
					return auth.user && (_.indexOf(auth.user.roles, 'admin') > -1 || _.indexOf(auth.user.roles, 'master') > -1);
				},
				hasMasterAuthorization: function(auth) {
					return auth.user && _.indexOf(auth.user.roles, 'master') > -1;
				},

			};
		}
	]);