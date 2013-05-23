var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');

/* ************************************
 * Configuration files can be found at nearly every level of an application.
 * They are JSON files whose manifest is context dependant.
 * ************************************ */

/* ******* CLOSURE ********* */

var _routes = function (name, rest) {
	if (rest){
		if (_DEBUG) 	console.log('config: %s, meta: %s', util.inspect(config), util.inspect(meta));
		var model = meta.models[config.model_name];
		if(!model){
			throw new Error(util.format('cannot get model %s', config.model_name));
		}
		return  {
			get:    ['*/' + name + '/:' +  model.primary_key + '?'],
			put:    ['*/' + name + '/:' +  model.primary_key],
			post:   ['*/' + name],
			delete: ['*/' + name + '/:' +  model.primary_key]
		}
	}
	return  {
		get:    ['*/' + name],
		put:    ['*/' + name],
		post:   ['*/' + name],
		delete: ['*/' + name]
	};
};
/* ********* EXPORTS ******** */

module.exports = function (root) {

	function _resolve (params) {
		if (_DEBUG)	console.log('CONFIGS HANDLER found config %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		var l = params.gate.latch();
		mkdirp(root);
		var config_path = path.resolve(root, path.basename(root) + '_config.json');
		// prevent overwriting of existing files
		var defaults = {
			routes: _routes(params.key)
		};

		fs.exists(config_path, function (ex) {
			if (!ex) {
				fs.writeFile(config_path
					, JSON.stringify(_.extend(defaults, params.value), true, 4), 'utf8', l);
			} else {
				l()
			}
		})
	}

	return parser.Handler(_resolve, 'config');
}; // end export function