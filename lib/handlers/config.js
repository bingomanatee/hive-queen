var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	console.log('creating config handler at root %s', root);
	return parser.Handler(function (params) {
		console.log('CONFIGS HANDLER found config %s at key %s, root %s', JSON.stringify(params.value, true, 2), params.key, root);
		var l = params.gate.latch();
		mkdirp(root);
		var config_path = path.resolve(root, path.basename(root) + '_config.json');
		// prevent overwriting of existing files
		path.exists(config_path, function (ex) {
			if (!ex) {
				fs.writeFile(config_path, JSON.stringify(params.value, true, 4), 'utf8', l);
			} else {
				l()
			}
		})
	}, 'config');
}; // end export function