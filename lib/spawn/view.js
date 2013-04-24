var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var path = require('path');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var view_path = path.resolve(__dirname + '/templates/view_template.html');

/* ********* EXPORTS ******** */

module.exports = function (script_view_path, cb) {
	if(!_.isArray(script_view_path)){
		script_view_path = script_view_path.split('/')
	}
	var script_view_dir = path.resolve(script_view_path.join('/'));

	fs.exists(script_view_dir, function(exists){
		if (exists){
			cb()
		} else {
			var write_stream = fs.createWriteStream(script_view_dir);
			var read_stream = fs.createReadStream(view_path);
			read_stream.pipe(write_stream);
			read_stream.on('end', cb)
		}
	});


} // end export function