var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var frame_handler = require('./../handlers/frame');
var config_handler = require('./../handlers/config');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return frame_handler(root)
	.then(function (hives_handler) {
			return parser.Parser([hives_handler]);

	}, function (err) { throw err; })
} // end export function