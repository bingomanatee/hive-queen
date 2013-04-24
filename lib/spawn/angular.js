var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

var make_angular_controller = require('./angular_controller');
/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (self, action_dir_root, config, cb) {

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

	if (!config.angular){
		return cb();
	}

	make_angular_controller(self, action_dir_root, config, function(){
		cb();
	})

}; // end export function