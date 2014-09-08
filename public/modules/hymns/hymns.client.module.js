'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('hymns');

angular.module('hymns').run(['uiSelect2Config', function(uiSelect2Config) {
    uiSelect2Config.allowClear = true;
}]);