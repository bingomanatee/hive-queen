var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp')
var Gate = require('gate');
var _DEBUG = false;
var rmdir = require('rmdir');
var spawn = require('./spawn');

module.exports = {
	spawn: function (spawn_root, config, cb) {
		if ( _DEBUG) console.log('spawning %s in %s', util.inspect(config), spawn_root);
		if (!cb) {
			cb = function () {
				if ( _DEBUG) console.log('done spawning %s', spawn_root);
			}
		}

		var self = this;
		if (_.isArray(config)) {
			config = {
				actions: config
			}
		}

		if (config.reset) {
		/*	delete config.reset;
			rmdir(spawn_root, function (err) {
				if (err) {
					return cb(err);
				}
				spawn(self, spawn_root, config, cb);
			}) */
		} else {
			spawn(self, spawn_root, config, cb);
		}
	}
};