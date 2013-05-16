var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var hive_parser = require('hive-parser');
var frame_handler = require('./../handlers/frames');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return frame_handler(path.resolve(root, 'frames'))
		.then(function(handler){
		return hive_parser.Parser([handler])
	})
} // end export function