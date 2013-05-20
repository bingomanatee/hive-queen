var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var actions_parser = require('./../parsers/actions');
var mkdirp = require('mkdirp');

/* ************************************
 * This handler responds to the discovery of an "actions" property.
 * It maps to the "actions" folder in a Hive, that contains ONLY Actions.
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