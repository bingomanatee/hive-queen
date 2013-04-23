var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var _DEBUG = false;
var view_template_path = path.resolve(__dirname, '_action_template.js');

module.exports = function (script_path, config, cb) {
	if (!_.isArray(script_path)) {
		script_path = script_path.split('/');
	}

	var config_dir = path.resolve(script_path.join('/'));

	fs.exists(config_dir, function (exists) {
		if (exists) {
			cb()
		} else {
			if (_DEBUG) console.log('writing action_script %s to %s', config_dir, script_path);

			var write_stream = fs.createWriteStream(config_dir);
			var read_stream = fs.createReadStream(view_template_path);
			read_stream.pipe(write_stream);
			read_stream.on('end', cb)
		}
	})

};