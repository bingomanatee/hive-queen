var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var resources_parser = require('./../parsers/resources');
var mkdirp = require('mkdirp');

/* ************************************
 * RESOURCES are collections of utility functions and pipes for
 *  - post-processing ACTIONS
 *  - interacting with MODEL data
 *  - modifying the runtime code with MIXINS
 *  - adding VIEW HELPERS
 *
 *  THey often fill the role of modules, except that they are accessible in the view or action namespace
 *  rather than through the require space, allowing for one FRAME to add functionality to another.
 *
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		var resources_root = path.resolve(root, 'resources');
		if (_DEBUG)	console.log(
			'RESOURCES HANDLER found resources %s at root %s'
			, JSON.stringify(params.value, true, 2), resources_root
		);
		mkdirp(resources_root);
		var l = params.gate.latch();
		return resources_parser(root).then(function(parser){
			parser.parse(params.value, l );
		})
	}, 'resources');
}; // end export function