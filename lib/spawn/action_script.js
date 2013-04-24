var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var dcopy = require('dank-copyfile');

var _DEBUG = false;
var view_template_path = path.resolve(__dirname, 'templates/action_template.js');
var view_single_template_path = path.resolve(__dirname, 'templates/action_template_single.js');

module.exports = function (script_path, config, cb) {

	if (!_.isArray(script_path)) {
		script_path = script_path.split('/');
	}

	var action_script_file = path.resolve(script_path.join('/'));

	fs.exists(action_script_file, function (exists) {
		if (exists) {
			cb()
		} else {
			var src = (config.single_method) ?  view_single_template_path: view_template_path;
			if (_DEBUG) console.log('writing action_script %s to %s', src, action_script_file);
			dcopy(src,  action_script_file, cb);
		}
	});

};