var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var frame_parser = require('./../parsers/frame');
var mkdirp = require('mkdirp');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		console.log('FRAME HANDLER found frame %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		mkdirp(root);
		var l = params.gate.latch();
		frame_parser(path.resolve(root, params.key)).then(function(parser){
			parser.parse(params.value, l );
		}, function(err){
			console.log(' ----------- error on frame parser', err);
			throw err;
		})
	});
}; // end export function