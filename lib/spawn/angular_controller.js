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

var con_template = path.resolve(__dirname, 'templates/ang_controller.js.txt');
var etemp;

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (action_dir_root, config, cb) {

	if (_DEBUG) console.log('action_dir_root: %s', util.inspect(action_dir_root));

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

	var con = config.angular.controller;
	if (!con) {
		return cb(new Error('no controller definition'));
	}
	if (_.isString(con)) {
		con = {
			name: con
		};
	}

	var app = config.angular.app || 'app';
	if (_.isString(app)) {
		app = {
			name: app
		};
	}

	var static_dir = config.angular.dir || con.dir || 'js';

	var con_dir = path.resolve(action_dir_root.join('/'), 'static', static_dir);
	var con_path = path.resolve(con_dir, con.name + '_controller.js');

	mkdirp(con_dir, function () {

		if (etemp) {
			fs.writeFile(con_path, etemp({con: con, app: app}), 'utf8', cb);
		} else {
			fs.readFile(con_template, 'utf8', function (err, template) {
				etemp = ejs.compile(template);
				fs.writeFile(con_path, etemp({app: app, con: con}), 'utf8', cb);
			})
		}

	});

}; // end export function