var mkdirp = require('mkdirp');
var Gate = require('gate');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var _DEBUG = true;
var spawn_action = require('./spawn_action');
var spawn_frame = require('./spawn_frame');

function _do_spawn(self, spawn_root, config, cb) {
	var gate = Gate.create();
	if (_DEBUG) console.log('spawn: spawn_root %s config %s', spawn_root, JSON.stringify(config, true, 3));

	if (config.actions) {
		_.each(config.actions, function (action, name) {
			if (_.isObject(action) && !action.name && isNaN(action.name)) {
				action.name = name;
			}
			spawn_action(self, spawn_root, action, gate.latch());
		})
	} else if (config.frames) {
		_.each(config.frames, function (frame, name) {
			if (!frame.name && isNaN(name)) {
				frame.name = name;
			}
			spawn_frame(self, spawn_root, frame, gate.latch());
		})
	}
	gate.await(cb);
}

module.exports = function (self, spawn_root, config, cb) {

	fs.exists(spawn_root, function (e) {
		if (!e) {
			mkdirp(spawn_root, function (e) {
				if (e) {
					return cb(new Error('cannot make directory ' + spawn_root));
				} else {
					_do_spawn(self, spawn_root, config, cb);
				}
			})
		} else {
			_do_spawn(self, spawn_root, config, cb);
		}

	})
}
