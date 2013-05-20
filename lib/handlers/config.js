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

/* ********* EXPORTS ******** */

module.exports = function (root) {

	function _resolve (params) {
		if (_DEBUG)	console.log('CONFIGS HANDLER found config %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		var l = params.gate.latch();
		mkdirp(root);
		var config_path = path.resolve(root, path.basename(root) + '_config.json');
		// prevent overwriting of existing files
		fs.exists(config_path, function (ex) {
			if (!ex) {
				fs.writeFile(config_path, JSON.stringify(params.value, true, 4), 'utf8', l);
			} else {
				l()
			}
		})
	}

	return parser.Handler(_resolve, 'config');
}; // end export function