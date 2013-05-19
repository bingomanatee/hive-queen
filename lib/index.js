var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Gate = require('gate');
var _DEBUG = false;
var spawn = require('./spawn');

module.exports = {
	frames_parser: require('./parsers/site'),
	spawn: function (spawn_root, config, cb) {
		if ( _DEBUG) console.log('spawning %s in %s', util.inspect(config), spawn_root);
		if (!cb) {
			cb = function () {
				if ( _DEBUG) console.log('done spawning %s', spawn_root);
			}
		}

		spawn( spawn_root, config, cb);
	}
};