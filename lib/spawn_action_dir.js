var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn_config = require('./spawn_config');
var _DEBUG = true;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var script_template_path = path.resolve(__dirname, '_action_template.js');
fs.exists(script_template_path, function (ex) {
	if (!ex) throw new Error("script template " + script_template_path + ' does not exist');
});

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

	if (!config) {
		config = {    name: name };
	} else if (_.isString(config)) {
		config = {name: config};
	}

	if (!config.routes) {
		config.routes = _routes(name)
	}

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

	var name = config.name;
	if (!name) throw new Error('no name in action config');

	var action_path = path.resolve(action_dir_root.join('/'));
	var script_path = path.resolve(action_dir_root.concat(name + '_action.js').join('/'));

	if (_DEBUG) {
		console.log('making action path: =============== %s', action_path);
	}
	mkdirp(action_path, function (err, result) {
		if (err) {
			console.log('error writing action %s: %s', action_path, err);
			return cb(err);
		}

		spawn_config(action_dir_root.concat([ name + '_config.json' ]), config, function (err) {
			if (err) {
				console.log('error writing config:', err);
				return cb(err);
			}

			var write_stream = fs.createWriteStream(script_path);
			var read_stream = fs.createReadStream(script_template_path);
			read_stream.pipe(write_stream);
			read_stream.on('end', cb)

		})

	})
}