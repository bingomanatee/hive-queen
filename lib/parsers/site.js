var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var frames_handler = require('./../handlers/frames');

/* ************************************
 * This is the fundamental handler that produces an entire site
 * based on a configuration file.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

/**
 * returns a promise to a parser.
 * @param root {string} -- a complete path to where you want to write the site. Should not end with "frames".
 * @returns {*}
 */
module.exports = function (root) {
	return frames_handler(path.resolve(root, 'frames'))
	.then(function(handler){
	return parser.Parser([handler])
	}, function(err){ throw err; })
}; // end export function