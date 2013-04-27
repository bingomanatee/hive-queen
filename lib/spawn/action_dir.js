var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn_config = require('./config');
var spawn_view = require('./view');
var spawn_action_script = require('./action_script');
var spawn_static_dir = require('./static_dir');
var spawn_angular = require("./angular");
var spawn_resource_dir = require('./resource_dir');

var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var _routes = function (name) {
	return  {
		get:    ['*/' + name],
		put:    ['*/' + name],
		post:   ['*/' + name],
		delete: ['*/' + name]
	};
};

/* ********* EXPORTS ******** */

module.exports = function (actions_dir_root, config, cb) {
	if (_DEBUG) {
		console.log('spawn_action_dir %s with config %s',
			util.inspect(actions_dir_root),
			util.inspect(config)
		)
	}
	if (!_.isFunction(cb)) {
		throw new Error('spawn_action_dir: no function cb');
	}

	if (_.isString(config)) {
		config = {name: config};
	}

	if (!config.routes) {
		config.routes = _routes(config.name)
	}

	if (!_.isArray(actions_dir_root)) {
		actions_dir_root = actions_dir_root.split('/');
	}

	var action_dir_root = actions_dir_root.concat([config.name]);
	var name = config.name;
	if (!name) throw new Error('no name in action config');

	var action_path = path.resolve(action_dir_root.join('/'));

	if (_DEBUG) {
		console.log('making action path: =============== %s', action_path);
	}
	mkdirp(action_path, function (err, result) {
		if (err) {
			console.log('error writing action %s: %s', action_path, err);
			return cb(err);
		}

		var view_path = action_dir_root.concat([ name + '_view.html' ]);
		if (_DEBUG) {
			console.log('actions_dir_root: %s', actions_dir_root.join(':'));
			console.log('view_path: %s', view_path.join(':'));
		}

		action_config = config.config ? config.config : {
			name: config.name
		};

		if (!action_config.name) {
			action_config.name = config.name;
		}

		spawn_config(action_dir_root.concat([ name + '_config.json' ]), action_config, function (err) {
			if (err) {
				console.log('error writing config:', err);
				return cb(err);
			}

			function do_view() {
				spawn_view(view_path, config, function () {
					if (err) {
						console.log('error writing template:', err);
						return cb(err);
					}

					spawn_static_dir(action_dir_root, config, cb);
				});
			}

			spawn_resource_dir(action_dir_root, config.resources, function () {

				spawn_action_script(action_dir_root, config, function () {

					if (config.angular) {
						spawn_angular(action_dir_root, config, do_view);
					} else if (config.rest) {
						cb()
					} else {
						do_view();
					}
				});
			})
		})
	})
};