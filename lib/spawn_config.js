var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = function (config_path, config, cb) {
	if (_.isArray(config_path)){
		config_path = path.resolve.apply(path, config_path);
	}

	if (_DEBUG) console.log('writing config %s to %s', util.inspect(config), config_path);

	try {
		var config_json = JSON.stringify(config, true, 4);
	} catch (err) {
		return cb(err);
	}
	fs.writeFile(config_path, config_json, cb);
};