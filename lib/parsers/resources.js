var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var resource_type_handler = require('./../handlers/resource_type');

/* ************************************
 * Parses the resources directory.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 *
 * @param root {string} an absolute directory path
 * @returns {Promise} the promise to a parser.
 */
module.exports = function (root) {
	var res_root = path.resolve(root, 'resources');
	if (_DEBUG) console.log('resources root: %s', res_root);
	return resource_type_handler(res_root)
	.then(function(handler){
		return parser.Parser([handler]);
	}, function(err){ throw err; })
}; // end export function