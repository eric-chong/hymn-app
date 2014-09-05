'use strict';

var _ = require('underscore');

exports.arrayToObject = function(array, key, value) {
	var obj;
	if (_.isArray(array)) {
		array.forEach(function(elem, index) {
			if (elem && elem[key]) {
				obj[elem[key]] = elem[value];
			}
		});
	}
	return obj;
};

exports.objectToArray = function(object, key, value) {
	return [];
};
