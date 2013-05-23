var mkdirp = require('mkdirp');
var Gate = require('gate');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var _DEBUG = false;
var spawn_frame_dir = require('./spawn/frame_dir');

function _harvest_models(config, models) {
	if (!models) {
		models = {};
	}
	_.each(config, function (value, key) {
			switch (key) {
				case 'model':
					if (_.isArray(value)) {
						value.forEach(function (data) {
							models[data.name] = data;
						})
					} else if (_.isObject(value)) {
						_.extend(models, value);
					} else {
					}
					break;

				default:
					if (!_.isString(value)) {
						_harvest_models(value, models);
					}
			}
		}
	);

	return models;
}

module.exports = function (spawn_root, config, cb) {
	if (_DEBUG) console.log('spawn: spawn_root %s config %s', spawn_root, JSON.stringify(config, true, 3));

	var models = _harvest_models(config);
	if (_DEBUG) 	console.log('models: %s', util.inspect(models));
	meta = {
		models: models
	};

	mkdirp(spawn_root, function (e) {
		if (_DEBUG)console.log('mkdirp');
		if (e) {
			console.log('error: %s', e);
			return cb(new Error('cannot make directory ' + spawn_root));
		} else {
			var gate = Gate.create();

			if (config.frames) {
				if (_DEBUG)    console.log('processing frames: %s', util.inspect(config.frames));
				_.each(config.frames, function (frame, name) {
					if (!frame.name && isNaN(name)) {
						frame.name = name;
						if (_DEBUG)console.log('assigning name %s to frame ', name);

					}
					spawn_frame_dir(spawn_root, frame, gate.latch(), meta);
				});
			} else {
				console.log('---- no frames in %s -----', JSON.stringify(config));
			}
			gate.await(cb);
		}
	})

};
