var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var hives_handler = require('./../handlers/hives');
var config_handler = require('./../handlers/config');
var res_handler = require('./../handlers/resources');

/* ************************************
 * Parses a single frame directory.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 *
 * @param root {string} an absolute directory path
 * @returns {Promise} the promise to a parser.
 */
module.exports = function (root) {
	return hives_handler(path.resolve(root, 'hives'))
		.then(function (handler_hives) {
			return config_handler(path.resolve(root))
				.then(function (handler_config) {
					return res_handler(root).then(function (handler_res) {
						return parser.Parser([handler_hives, handler_res, handler_config]);
					}, function (err) { throw err; });
				});
		}, function (err) { throw err; });
}; // end export function