var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var hive_parser = require('./../parsers/hive');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		if (_DEBUG) console.log('HIVE HANDLER found hive %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		root = path.resolve(root, params.key);
		mkdirp(root);
		var l = params.gate.latch();
		hive_parser(root).then(function(parser){
			parser.parse(params.value, l );
		}, function(err){
			console.log(' ----------- error on hive parser', err);
			throw err;
		})
	});
}; // end export function