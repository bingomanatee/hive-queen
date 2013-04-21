var mkdirp = require('mkdirp');
var Gate = require('gate');
var path = require('path');
var _DEBUG = false;
var spawn_action = require('./spawn_action');
var spawn_config = require('./spawn_config');

function _spawn(self, root, frame_config, cb) {
	var gate = Gate.create();
	var frame_dir = path.resolve(root, frame_config.dir);
	var actions_dir = path.resolve(frame_dir, 'actions');

	mkdirp(frame_dir, function (err) {
		var config = frame_config.config ? frame_config.config: {name:frame_config.name || frame_config.dir};
		spawn_config(path.resolve(frame_dir, frame_config.dir + '.json' ), config, function(){
			mkdirp(actions_dir, function (err) {
				if (frame_config.actions) {
					_.each(frame_config.actions, function (action_config, name) {
						if(!action_config.name){
							if (isNaN(name)){
								action_config.name = name;
							} else {
								throw new Error('no name for action ' + util.inspect(action_config));
							}
						}
						spawn_action(self, root, action_config, gate.latch());
					})
				}
				gate.await(cb);
			})
		})
	})
}

module.exports = function (self, root, frame_config, cb) {

	fs.exists(root, function (e) {
		if (!e) {
			mkdirp(root, function (e) {
				if (e) {
					return cb(new Error('cannot make directory ' + root));
				} else {
					_spawn(self, root, frame_config, cb);
				}
			})
		} else {
			_spawn(self, root, frame_config, cb);
		}

	})
}
