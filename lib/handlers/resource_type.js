var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var models_parser = require('./../parsers/models');
var view_helper_parser = require('./../parsers/view_helpers');

/* ************************************
 * RESOURCE_TYPE handles the multitude of resource types (see)
 * with branches for each variety.
 *
 * NOTE: this handler is extensible
 * by adding your own custom types collection to the
 * types property of this module.
 *
 * By convention the resource type directory name is SINGULAR:
 * model rather than models.
 *
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

 function rt_factory(root) {
	return parser.Handler(function (params) {
		var resource_root = path.resolve(root, params.key);
		if (_DEBUG) {
			console.log('RESOURCE TYPE HANDLER found %s dir  %s : making root %s'
				, params.key, JSON.stringify(params.value, true, 2), resource_root);
		}

		var l = params.gate.latch();
		mkdirp(resource_root, function () {
			if (rt_factory.types[params.key]){
				return rt_factory.types[params.key](resource_root, params, l);
			} else {
				console.log("CANNOT INTERPRET RESOURCE TYPE %s", params.key);
				l();
			}
		});
	});
}; // end export function

rt_factory.types = {
	model: function(resource_root, params, l){
		return models_parser(resource_root).then(function (parser) {
			parser.parse(params.value, l);
		}, function (err) { throw err; })
	},
	view_helper: function(resource_root, params, l){
		return view_helper_parser(resource_root).then(function(parser){
			parser.parse(params.value, l);
		}, function(err) { throw err; })
	}
};

module.exports = rt_factory;