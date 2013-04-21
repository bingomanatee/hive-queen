var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var _DEBUG = false;

module.exports = function (config_path, config, cb) {
	if (!_.isArray(config_path)){
		config_path = config_path.split('/');
	}

	 var config_dir = path.resolve(config_path.join('/'));

	if (_DEBUG) console.log('writing config %s to %s', config_dir, config_path);

	try {
		var config_json = JSON.stringify(config, true, 4);
	} catch (err) {
		return cb(err);
	}
	fs.writeFile(config_dir, config_json, cb);
};