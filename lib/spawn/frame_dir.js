var mkdirp = require('mkdirp');
var Gate = require('gate');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var _DEBUG = false;
var spawn_hive_dir = require('./hive_dir');
var spawn_config = require('./config');
var spawn_resource_dir = require('./resource_dir');

module.exports = function ( spawn_root, frame_config, cb, meta) {


	if (_DEBUG) {
		console.log('fd meta: %s', util.inspect(meta));
		console.log('spawn_frame_dir ---------------------- : in %s config %s',
			spawn_root, JSON.stringify(frame_config, true, 3)
		)
	}

	if (!_.isArray(spawn_root)) {
		spawn_root = spawn_root.split('/');
	}
	if (!(_.last(spawn_root) == 'frames')) {
		spawn_root = spawn_root.concat(['frames'])
	}

	var frame_root_dir = spawn_root.concat([frame_config.name]);
	var frame_root_path = path.resolve(frame_root_dir.join('/'));

	if (_DEBUG)    console.log('making %s', frame_root_path);
	mkdirp(frame_root_path, function (e) {
		if (e) {
			console.log('err %s', e);
			return cb(new Error('cannot make directory ' + frame_root_dir));
		}

		var hives_dir = frame_root_dir.concat('hives');
		var hives_path = path.resolve(hives_dir.join('/'));
		if (_DEBUG) {
			console.log('hive_root_dir: %s from %s', hives_path, hives_dir.join(':'));
			console.log('hives_path: %s', hives_path);
		}

		spawn_resource_dir(frame_root_dir, frame_config.resources, function () {
			mkdirp(hives_path, function (err) {
				var gate = Gate.create();

				console.log('making frame with %s', util.inspect(frame_config));
				var config = frame_config.config ? _.clone(frame_config.config ): {
					name: frame_config.name
				};

				if (!config.root_route) {
					config.root_route = '/' + frame_config.name
				}

				spawn_config(frame_root_dir.concat(frame_config.name + '_config.json'), config, function () {
					if (frame_config.hives) {
						_.each(frame_config.hives, function (hive_config, name) {
							if (_.isString(hive_config)) {
								hive_config = {name: hive_config};
							}

							if (!hive_config.name) {
								if (isNaN(name)) {
									hive_config.name = name;
								} else {
									throw new Error('no name for action ' + JSON.stringify(action_config, true, 3));
								}
							}

							if (_DEBUG)    console.log('------- spawn hive dir --------');
							spawn_hive_dir( hives_dir, hive_config, gate.latch(), meta);
						})
					} else {
						if (_DEBUG)    console.log('no hives in %s', JSON.stringify(frame_config, true, 3));
					}
					gate.await(cb);
				})
			})
		}, meta);
	})
}
