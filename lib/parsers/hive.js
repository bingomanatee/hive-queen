var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var actions_handler = require('./../handlers/actions');
var config_handler = require('./../handlers/config');
var resources_handler = require('./../handlers/resources');

/* ************************************
 * Parses a single hive directory.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 *
 * @param root {string} an absolute directory path
 * @returns {Promise} the promise to a parser.
 */

module.exports = function (root) {
	if (_DEBUG) console.log('hive parser root: %s', root);
	return config_handler(path.resolve(root))
		.then(function (handler_config) {
			return resources_handler(path.resolve(root))
				.then(function (handler_resources) {
					return actions_handler(root)
						.then(function (handler_actions) {
							return parser.Parser([ handler_actions, handler_resources, handler_config]);
						})
				})
		}, function (err) { throw err; })
}; // end export function