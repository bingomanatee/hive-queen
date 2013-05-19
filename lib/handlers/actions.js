var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = true;
var parser = require('hive-parser');
var actions_parser = require('./../parsers/actions');
var mkdirp = require('mkdirp');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function(params){
		if (_DEBUG)	console.log('ACTIONS HANDLER found actions %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		mkdirp(root);
		var l = params.gate.latch();
		actions_parser(root).then(function(parser){
			parser.parse(params.value, l );
		}, function(err){ throw err; })
	}, 'actions');
}; // end export function