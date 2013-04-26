var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Gate = require('gate');
var mkdirp = require('mkdirp');
var _DEBUG = false;

var resource_type = require('./resource_type');

/* ************************************
 * creates static directories
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root_dir, config, cb) {
	if (_DEBUG) console.log('resources_dir --- root dir: %s, config: %s', root_dir.join(':'), util.inspect(config));
	if (!config) {
		return cb();
	}

	if (!_.isArray(root_dir)) {
		root_dir = root_dir.split('/');
	}

	var resources_dir = root_dir.concat(['resources']);
	var resources_path = path.resolve(resources_dir.join('/'));

	var gate = Gate.create();

	mkdirp(resources_path, function(err){

		_.each(config, function(files, type){
			if (_DEBUG) console.log('type: %s, files: %s', type, util.inspect(files));
			var l =  gate.latch();
			var subtype_dir = resources_dir.concat([type]);
			var subtype_path = subtype_dir.join('/');
			if (_DEBUG) console.log('writing into subtype_path: %s', subtype_path);
			mkdirp(path.resolve(subtype_path), function(){
				_.each(files, function(def){
					if (_DEBUG) console.log('.... resource type %s config: %s', type, util.inspect(def));
					resource_type(subtype_dir, def, type, gate.latch());
				});
				l();
			});
		});


		gate.await(cb);
	})
}; // end export function