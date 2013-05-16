var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var hive_parser = require('hive-parser');
var frame_parser = require('./../parsers/frame');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return hive_parser.Handler(function(params){
		console.log('found frames at root %s: %s', root, util.inspect(params.value));
		var l = params.gate.latch();
		frame_parser(root).then(function(parser){
			parser.parse(params.value, l );
		})
	}, 'frames');
}; // end export function