var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn_config = require('./spawn_config');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var script_template_path = path.resolve(__dirname, '_action_template.js');
fs.exists(script_template_path, function(ex){
	if (!ex) throw new Error("script template " + script_template_path + ' does not exist');
});

var _routes = function (name) {
	return  {
		get:    ['*/' + name],
		put:    ['*/' + name],
		post:   ['*/' + name],
		delete: ['*/' + name]
	};
};

/* ********* EXPORTS ******** */

module.exports = function (action_frame_path, config, cb) {
	var name = config.name;
	if (!name) throw new Error('no name in action config');
	
	if (!config) {
		config = {
			name:   name,
			routes: _routes(name)
		}
	} else if (!config.routes) {
		config.routes = _routes(name)
	}

	if (_.isArray(action_frame_path)){
		action_frame_path = action_frame_path.concat([name]);
	} else {
		action_frame_path = [action_frame_path, name]
	}
	var frame_path = path.resolve.apply(path, action_frame_path);
	var script_path = path.resolve.apply(path, action_frame_path.concat( name + '_action.js'));
	
	mkdirp(frame_path, function (err) {
		if (err) {
			console.log('error writing action %s: %s', action_path, err);
			return cb(err);
		}

		spawn_config(action_frame_path.concat([ name + '_config.json' ]), config, function(err){
			if (err) {
				console.log('error writing config:', err);
				return cb(err);
			}

			var write_stream = fs.createWriteStream(script_path);
			var read_stream = fs.createReadStream(script_template_path);
			read_stream.pipe(write_stream);
			read_stream.on('end', function(){
				cb();
			})

		})

	})
}