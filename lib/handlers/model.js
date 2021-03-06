var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var model_factory = require('./../utils/resources/model_factory');

/* ************************************
 * A model is represented by a single file.
 * There are no requirements of the API for a model,
 * other than that of the actual repository.
 *
 * The hive-model npm module is intended as a "starter system"
 * for testing and developing models, but is not useful for production code.
 * (the data is never saved to disk for one thing.)
 * ************************************ */

/* ******* CLOSURE ********* */

var mn_template = _.template('<%= key %>_model.js');
function _model_name(key) {
	return mn_template({key: key});
}

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return parser.Handler(function (params) {
		var model_path = path.resolve(root, _model_name(params.key));
		if (_DEBUG) console.log('MODEL HANDLER found model %s at key %s: making root %s', JSON.stringify(params.value, true, 2), params.key, model_path);
		var l = params.gate.latch();

		model_factory(function(err, model){
			model(model_path,  params, l);
		});
	});
}; // end export function