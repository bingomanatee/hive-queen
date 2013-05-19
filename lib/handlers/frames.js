var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var frame_parser = require('./../parsers/frames');
var mkdirp = require('mkdirp');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		if (_DEBUG)	console.log('FRAMES HANDLER found frames %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		mkdirp(root);
		var l = params.gate.latch();
		frame_parser(root).then(function(parser){
			parser.parse(params.value, l );
		})
	}, 'frames');
}; // end export function