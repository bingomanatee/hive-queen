var mkdirp = require('mkdirp');
var Gate = require('gate');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var _DEBUG = false;
var spawn_action_dir = require('./action_dir');
var spawn_config = require('./config');
var spawn_resource_dir = require('./resource_dir');

//@TODO: move hive root directory creation into here from frames
module.exports = function (self, hives_root, hive_config, cb) {
	if (_DEBUG)        console.log('spawn_hive_dir: %s config%s', hive_root, util.inspect(hive_config), hive_config);

	var gate = Gate.create();
	hives_root = _.isArray(hives_root) ? hives_root : hives_root.split('/');
	var hive_dir = hives_root.concat([hive_config.name]);
	if (_DEBUG) {
		console.log('hive_root: %s', hive_root.join(':'));
		console.log('actions_path: %s', actions_path);
	}

	var actions_dir = hive_dir.concat(['actions']);
	var actions_path = actions_dir.join('/'); // since actions path has the hive in its way it will spawn all the subdirs necessary

	mkdirp(actions_path, function (err) {
		var config = hive_config.config ? hive_config.config : {name: hive_config.name};

		spawn_resource_dir(hive_dir, hive_config.resources, function () {
			spawn_config(hive_dir.concat([hive_config.name + '_config.json']), config, function () {
				if (hive_config.actions) {
					_.each(hive_config.actions, function (action_config, name) {
						if (_.isString(action_config)) {
							action_config = {name: action_config};
						}
						if (!action_config.name) {
							if (isNaN(name)) {
								action_config.name = name;
							} else {
								throw new Error('no name for action ' + JSON.stringify(action_config, true, 3));
							}
						}
						spawn_action_dir(self, actions_dir, action_config, gate.latch());
					})
				}
				gate.await(cb);
			})
		})
	})

};
