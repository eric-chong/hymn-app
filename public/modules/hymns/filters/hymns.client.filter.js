'use strict';

angular.module('hymns')
    .filter('lyricLangsCssClass', function() {
        return function(array) {
            if (!_.isArray(array)) return '';

            return array.toString().replace(',', ' ');
        };
    })

    .filter('concatNames', function() {
    	return function(names) {
    		var fullName = '';

    		if (_.isArray(names)) {
    			names.forEach(function(elem, index) {
    				if (index > 0 && elem.name) fullName = fullName.concat(' - ');

    				fullName = fullName.concat(elem.name);
    			});
    		}

    		return fullName;
    	};
    })

    .filter('filterHymnOrHymnbook', function() {
        return function(array, searchObj) {
            if (!_.isArray(array)) return array;
            if (!searchObj) return array;

            if (!searchObj.name && !searchObj.publisherId && !searchObj.hymnbookId && 
                !searchObj.langs.en && !searchObj.langs.zhCAN && !searchObj.langs.zhMAN ) return array;

            var matchedArray = [];
            array.forEach(function(elem) {
                var matched = true;
                if (searchObj.name && elem.names && _.isArray(elem.names)) {
                    var nameMatched = false;
                    elem.names.forEach(function(nameObj) {
                        if (nameObj.name.toLowerCase().indexOf(searchObj.name.toLowerCase()) > -1) nameMatched = true;
                    });
                    matched = nameMatched;
                }
                if (searchObj.publisherId && elem.publisher && elem.publisher._id) {
                    if (elem.publisher._id !== searchObj.publisherId) matched = false;
                } else if (searchObj.publisherId && !elem.publisher) {
                    matched = false;
                }
                if (searchObj.hymnbookId && elem.hymnbook && elem.hymnbook._id) {
                    if (elem.hymnbook._id !== searchObj.hymnbookId) matched = false;
                } else if (searchObj.hymnbookId && !elem.hymnbook) {
                    matched = false;
                }
                var searchLangsList = [];
                if (searchObj.langs.en) searchLangsList.push('en');
                if (searchObj.langs.zhCAN) searchLangsList.push('zh-CAN');
                if (searchObj.langs.zhMAN) searchLangsList.push('zh-MAN');
                if (searchLangsList.length !== _.intersection(searchLangsList, elem.lyricLangs).length) matched = false;

                if (matched) matchedArray.push(elem);
            });

            return matchedArray;
        };
    });