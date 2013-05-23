var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Gate = require('gate');
var mkdirp = require('mkdirp');
var _DEBUG = false;

/* ************************************
 * creates static directories
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root_dir, config, cb) {
	if (config.static === false) {
		return cb();
	}

	if (!_.isArray(root_dir)) {
		root_dir = root_dir.split('/');
	}

	var static_dir = root_dir.concat(['static']);
	var static_path = path.resolve(static_dir.join('/'), 'static');
	var static_config = config.static;

	var gate = Gate.create();

	mkdirp(static_path, function(err){
		//@TODO: handle err

		if (!static_config){
			static_config = {
				'/js': '*/js',
				'/css': '*/css',
				'/img': '*/img'
			};

			config.static = static_config;
		}

		_.each(static_config, function(target, dir){
			var static_subpath = static_path + dir;
			mkdirp(static_subpath, gate.latch());
		});


		gate.await(cb);
	})
}; // end export function