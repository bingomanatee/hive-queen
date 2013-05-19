var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var frames_handler = require('./../handlers/frames');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return frames_handler(path.resolve(root, 'frames'))
		.then(function(handler){
		return parser.Parser([handler])
	}, function(err){
			console.log('error on frames parser', err);
			throw err;
		})
} // end export function