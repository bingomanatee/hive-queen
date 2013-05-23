var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

var make_angular_controller = require('./angular_controller');
var make_angular_app = require('./angular_app');
/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (action_dir_root, config, cb) {

	if (!_.isArray(action_dir_root)) {
		action_dir_root = action_dir_root.split('/');
	}

	if (!config.angular){
		return cb();
	}

	make_angular_controller( action_dir_root, config, function(){
		if (config.angular.app){
			make_angular_app(action_dir_root, config, cb);
		} else {
			cb();
		}
	})

}; // end export function