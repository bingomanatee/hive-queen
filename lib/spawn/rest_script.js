var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var dcopy = require('dank-copyfile');
var ejs = require('ejs');

var _DEBUG = false;
var view_template_path = path.resolve(__dirname, 'templates/action_rest.js.txt');
var etemp;

function temp(params){
	var txt = etemp(params);

	return txt.replace(/\n[\s]*\n[\s]*\n/g, "\n");
}

module.exports = function (script_path, config, cb) {

	if (!_.isArray(script_path)) {
		script_path = script_path.split('/');
	}

	var action_script_file = path.resolve(script_path.join('/'), config.name + '_action.js');

	fs.exists(action_script_file, function (exists) {
		if (exists) {
			cb()
		} else {

			var data = _.extend({
				model_name: config.name,
				model_type: 'default',
				primary_key: 'id',
				url_param_name: false
			}, config);

			if (etemp) {
				fs.writeFile(action_script_file, temp(data), 'utf8', cb);
			} else {
				fs.readFile(view_template_path, 'utf8', function (err, template) {
					etemp = ejs.compile(template);
					fs.writeFile(action_script_file, temp(data), 'utf8', cb);
				})
			}
		}
	});

};