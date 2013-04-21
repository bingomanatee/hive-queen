
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var spawn_action_dir = require('./spawn_action_dir');
var _DEBUG = true;

module.exports = function (self, actions_dir, action, cb) {
	if (_DEBUG){
		console.log("\n\n\n\n\n spawn_action: actions_dir %s, action %s",
			util.inspect(actions_dir),
			util.inspect(action)

		)
	}
	if (!_.isFunction(cb)){
		throw new Error('spawn_action: no function cb');
	}

	if (!_.isArray(actions_dir)){
		actions_dir = actions_dir.split('/');
	}
	if (!_.last(actions_dir) == 'actions'){
		actions_dir = actions_dir.concat(['actions']);
	}

	if (_.isObject(action)) {
		spawn_action_dir(self, actions_dir, action, cb);
	} else {
		spawn_action_dir(self, actions_dir, action, cb);
	}
};