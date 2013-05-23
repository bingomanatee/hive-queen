var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var mkdirp = require('mkdirp');
var ejs = require('ejs');

/* ************************************
 * 
 * ************************************ */

var con_template = path.resolve(__dirname, 'templates/ang_app.js.txt');
var etemp;

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (action_dir_root, config, cb) {

if (_DEBUG)	console.log('action_dir_root: %s', util.inspect(action_dir_root));

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

	var app = config.angular.app || 'app';
	if (_.isString(app)) {
		app = {
			name: app
		};
	}

	if (!app.deps) {
		app.deps = [];
	}

	var static_dir = config.angular.dir || app.dir || 'js';

	var app_dir = path.resolve(action_dir_root.join('/'), 'static', static_dir);
	var app_path = path.resolve(app_dir, app.name + '_app.js');

	mkdirp(app_dir, function () {

		if (etemp) {
			fs.writeFile(app_path, etemp({app: app}), 'utf8', cb);
		} else {
			fs.readFile(con_template, 'utf8', function (err, template) {
				etemp = ejs.compile(template);
				fs.writeFile(app_path, etemp({app: app}), 'utf8', cb);
			})
		}

	});

}; // end export function