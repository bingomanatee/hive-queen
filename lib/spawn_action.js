
var spawn_action_dir = require('./spawn_action_dir');
var _DEBUG = true;

module.exports = function (self, root, action, cb) {
	var args = _.toArray(arguments);
	if (_DEBUG) console.log('spawn_action(%s)', util.inspect(args));
	var action_dir = path.resolve(root, 'actions');
	if (_DEBUG) console.log('spawn_action for action dir %s', action_dir);

	if (_.isObject(action)) {
		spawn_action_dir(action_dir, action.name, cb, action);
	} else {
		spawn_action_dir(action_dir, action, cb);
	}
};