var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn_config = require('./spawn_config');
var spawn_view = require('./spawn_view');
var spawn_action_script = require('./spawn_action_script');
var spawn_static_dir = require('./spawn_static_dir');

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

module.exports = function (self, action_dir_root, config, cb) {
	if (_DEBUG) {
		console.log('spawn_action_dir %s with config %s',
			util.inspect(action_dir_root),
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

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

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
			console.log('action_dir_root: %s', action_dir_root.join(':'));
			console.log('view_path: %s', view_path.join(':'));
		}
		spawn_view(view_path, function () {
			if (err) {
				console.log('error writing template:', err);
				return cb(err);
			}

			spawn_static_dir(action_dir_root, config, function (err) {

				spawn_config(action_dir_root.concat([ name + '_config.json' ]), config, function (err) {
					if (err) {
						console.log('error writing config:', err);
						return cb(err);
					}

					spawn_action_script(action_dir_root.concat([name + '_action.js']), config, cb);
				})

			})
		})

	})
}