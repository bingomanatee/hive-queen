var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var hive_parser = require('./../parsers/hive');

/* ************************************
 * A HIVE is a sub-collection of ACTIONS inside a specific FRAME. It also contains a RESOURCES directory
 * and optionally, LAYOUTS.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		var hive_root = path.resolve(root, params.key);

		if (params.value.config && !params.value.config.base_route){
			params.value.config.base_route  = '/' + params.key;
		}
		if (_DEBUG) console.log('HIVE HANDLER found hive %s at key %s: making root %s'
			, JSON.stringify(params.value, true, 2), params.key, hive_root);
		var l = params.gate.latch();
		mkdirp(hive_root, function(){
			hive_parser(hive_root).then(function(parser){
				parser.parse(params.value, l );
			}, function(err){
				console.log(' ----------- error on hive parser', err);
				throw err;
			})
		});
	});
}; // end export function