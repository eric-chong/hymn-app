'use strict';

angular.module('ui.components')

.directive('uiToggleBtn', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			uiToggleBtnValue: '=',
			uiToggleBtnLabel: '@'
		},
		template: 
			'<div class="ui-toggle">' +
				'<div class="ui-toggle-btn" ng-class="{on: uiToggleBtnValue, off: !uiToggleBtnValue}" ng-click="uiToggleBtnValue=!uiToggleBtnValue">' + 
					'<div class="toggler"></div>' +
				'</div>' +
				'<div class="ui-toggle-label">{{uiToggleBtnLabel}}</div>' +
			'</div>'
	};
})

.directive('uiGroupCheckbox', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			uiGroupCheckboxCssClass: '@',
			uiGroupCheckboxModel: '=',
			uiGroupCheckboxValues: '=',
			uiGroupCheckboxLabels: '='
		},
		template: 
			'<div class="ui-group-checkbox {{uiGroupCheckboxCssClass}}">' +
				'<div class="ui-checkbox" ng-repeat="item in uiGroupCheckboxValues track by $index">' +
					'<span class="fa-stack" ng-click="select(item)">' + 
						'<i class="fa fa-circle-thin fa-stack-2x" ng-class="{checked: isChecked(item)}"></i>' +
						'<i class="fa fa-check fa-stack-1x" ng-show="isChecked(item)"></i>' +
					'</span>' +
					'<div class="ui-group-checkbox-label" ng-click="select(item)">{{uiGroupCheckboxLabels[item]}}</div>' +
				'</div>' +
			'</div>',
		link: function(scope, elem, attrs) {
			scope.isChecked = function(item) {
				return _.isArray(scope.uiGroupCheckboxModel) && scope.uiGroupCheckboxModel.indexOf(item) > -1;
			};

			scope.select = function(item) {
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
})

.directive('uiIconBtn', function() {
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
		template:
			'<div class="ui-icon-btn {{uiIconBtnCssClass}}" ng-click="uiIconBtnOnClick()">' +
				'<span class="fa-stack {{uiIconBtnClass}}" tooltip="{{uiIconBtnTooltip}}" tooltip-placement="{{uiIconBtnTooltipPlacement}}">' +
					'<i class="fa fa-circle-thin fa-stack-2x"></i>' +
					'<i class="fa fa-{{uiIconBtnIconClass}} fa-stack-1x"></i>' +
				'</span>' +
			'</div>'
	};
})

.directive('uiBtn', function() {
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
		template:
			'<div class="ui-btn {{uiBtnCssClass}}">' +
				'<button type="{{uiBtnType}}" class="{{uiBtnBtnCssClass}}" ng-click="uiBtnOnClick()" ' + 
					'tooltip="{{uiBtnTooltip}}" tooltip-placement="{{uiBtnTooltipPlacement}}">' +
					'<i class="fa fa-{{uiBtnIconClass}}" ng-show="uiBtnIconClass"/> {{uiBtnLabel}}' +
				'</button>' +
			'</div>'
	};
});