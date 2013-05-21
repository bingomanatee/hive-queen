var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var view_helper_handler = require('./../handlers/view_helper');

/* ************************************
 * Parses a collection of models
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 *
 * @param root {string} an absolute directory path
 * @returns {Promise} the promise to a parser.
 */
module.exports = function (root) {
	if (_DEBUG) console.log('view helpers parser root: %s', root);
	return view_helper_handler(root)
		.then(function (handler_model) {
			return parser.Parser([handler_model]);
		})
}; // end export function