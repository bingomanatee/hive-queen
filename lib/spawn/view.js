var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var path = require('path');
var _DEBUG = false;
var copyfile = require('dank-copyfile');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var view_path = path.resolve(__dirname + '/templates/view_template.html');

/* ********* EXPORTS ******** */

module.exports = function (script_view_path, config, cb) {
	if(!_.isArray(script_view_path)){
		script_view_path = script_view_path.split('/')
	}
	var script_view_dir = path.resolve(script_view_path.join('/'));


	fs.exists(script_view_dir, function(exists){
		if (exists){
			cb()
		} else if (config.template_content){
			fs.writeFile(script_view_dir, config.template_content, 'utf8', cb);
		} else {
			copyfile(view_path, script_view_dir, cb);
		}
	});


} // end export function