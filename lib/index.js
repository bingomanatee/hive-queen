var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var Component = require('hive-component');
var mkdirp = require('mkdirp')
var Gate = require('gate');
var _DEBUG = false;
var rmdir = require('rmdir');
var spawn = require('./spawn');


module.exports = function (root, config, cb) {
	console.log('spawning %s in %s', util.inspect(config), root);
	if (!cb) {
		cb = function () {
			console.log('done spawning %s', root);
		}
	}

	var self = this;
	if (_.isArray(config)) {
		config = {
			actions: config
		}
	}

	if (config.reset) {
		delete config.reset;
		rmdir(root, function (err) {
			if (err) {
				return cb(err);
			}
			spawn(self, root, config, cb);
		})
	} else {
		spawn(self, root, config, cb);
	}
}