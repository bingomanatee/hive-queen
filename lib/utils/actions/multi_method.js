var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var ejs = require('ejs');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
var template_path = path.resolve(__dirname, '../multi_method_handler.js');
var handler;

function  _handler(phase, method) {
	return handler({phase: phase, method: method});
}
/* ********* EXPORTS ******** */

module.exports = function (callback) {
	if (handler){
		return callback(null, _handler)
	}
	fs.readFile(template_path, 'utf8', function (err, template) {

		handler = ejs.compile(template);

		callback(null, _handler);
	})
}; // end export function