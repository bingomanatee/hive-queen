var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var hives_parser = require('./../parsers/hives');
var mkdirp = require('mkdirp');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		if (_DEBUG)	console.log('HIVES HANDLER found hives %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		mkdirp(root);
		var l = params.gate.latch();
		hives_parser(root).then(function(parser){
			parser.parse(params.value, l );
		}, function(err){
			console.log('---------- error on hives parser', err);
			throw err;
		})
	}, 'hives');
}; // end export function