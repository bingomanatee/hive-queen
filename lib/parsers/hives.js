var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var hive_handler = require('./../handlers/hive');

/* ************************************
 * Parses the hives directory.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 *
 * @param root {string} an absolute directory path
 * @returns {Promise} the promise to a parser.
 */
module.exports = function (root) {
	if (_DEBUG) console.log('hives root: %s', root);
	return hive_handler(root)
	.then(function(handler){
		return parser.Parser([handler]);
	}, function(err){ throw err; })
}; // end export function