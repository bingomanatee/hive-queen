var mkdirp = require('mkdirp');
var Gate = require('gate');

var _DEBUG = false;
var spawn_action = require('./spawn_action');
var spawn_frame = require('./spawn_frame');

function _do_spawn(self, root, config, cb) {
	var gate = Gate.create();
	var actions_dir = path.resolve(root, 'actions');
	if (_DEBUG) console.log('making action dir %s with config %s', actions_dir, util.inspect(config));
	mkdirp(actions_dir, function (err) {
		if (config.actions) {
			_.each(config.actions, function (action) {
				spawn_action(self, root, action, gate.latch());
			})
		} else if (config.frames){
			_.each(config.frames, function(frame){
				spawn_frame(self, root, frame, gate.latch());
			})
		}
		gate.await(cb);
	})
}

module.exports = function (self, root, config, cb) {

	fs.exists(root, function (e) {
		if (!e) {
			mkdirp(root, function (e) {
				if (e) {
					return cb(new Error('cannot make directory ' + root));
				} else {
					_do_spawn(self, root, config, cb);
				}
			})
		} else {
			_do_spawn(self, root, config, cb);
		}

	})
}
