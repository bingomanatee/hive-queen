var mkdirp = require('mkdirp');
var Gate = require('gate');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var _DEBUG = true;
var spawn_action_dir = require('./spawn_action_dir');
var spawn_config = require('./spawn_config');

function _spawn(self, spawn_root, frame_config, cb) {

	if (_DEBUG) {
		console.log('spawn_frame: in %s config %s',
			spawn_root, JSON.stringify(frame_config, true, 3)
		)
	}

	var gate = Gate.create();
	var frame_dir = _.isArray(spawn_root) ? spawn_root : spawn_root.split('/');
	frame_dir.push('frames', frame_config.name);
	var frame_root = path.resolve(frame_dir.join('/'));
	var actions_dir = frame_dir.concat('actions');
	var actions_path = path.resolve(actions_dir.join('/'));
	if (_DEBUG) {
		console.log('frame_root: %s from %s', frame_root, frame_dir.join(':'));
		console.log('actions_path: %s', actions_path);
	}

	mkdirp(frame_root, function (err) {
		var config = frame_config.config ? frame_config.config : {name: frame_config.name};
		spawn_config(frame_dir.concat(frame_config.name + '_config.json'), config, function () {
			mkdirp(actions_path, function (err) {
				if (frame_config.actions) {
					_.each(frame_config.actions, function (action_config, name) {
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
						var action_path_dir = actions_dir.concat(action_config.name);
						console.log('action_path_dir: %s', action_path_dir.join(':'));
						spawn_action_dir(self, action_path_dir, action_config, gate.latch());
					})
				}
				gate.await(cb);
			})
		})
	})
}

module.exports = function (self, spawn_root, frame_config, cb) {

	fs.exists(spawn_root, function (e) {
		if (!e) {
			mkdirp(spawn_root, function (e) {
				if (e) {
					return cb(new Error('cannot make directory ' + spawn_root));
				} else {
					_spawn(self, spawn_root, frame_config, cb);
				}
			})
		} else {
			_spawn(self, spawn_root, frame_config, cb);
		}

	})
}
