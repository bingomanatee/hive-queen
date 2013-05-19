var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = true;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var action_parser = require('./../parsers/action');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		var action_root = path.resolve(root, params.key);
		if (_DEBUG) console.log('ACTION HANDLER found action %s at key %s: making root %s' , JSON.stringify(params.value, true, 2), params.key, action_root);
		var l = params.gate.latch();
		mkdirp(action_root, function(){
			action_parser(action_root).then(function(parser){
				parser.parse(params.value, l );
			}, function(err){ throw err; })
		});
	});
}; // end export function