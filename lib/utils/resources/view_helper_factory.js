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
var template_path = path.resolve(__dirname, './../../templates/view_helper.js');
if (!fs.existsSync(template_path)){
	throw new Error(util.format('no file at %s', template_path));
}
var handler;

function  _handler(model_path, params, l) {
	console.log('view helper params: %s', util.inspect(params));
	var model_params = _.extend({ name: params.key, weight: 0}, params.value);
	fs.writeFile(model_path,  handler(model_params), l);
}
/* ********* EXPORTS ******** */

module.exports = function (callback) {
	if (handler){
		return callback(null, _handler)
	}
	fs.readFile(template_path, 'utf8', function (err, template) {

		if (_DEBUG) console.log('template: %s', template);
		handler = ejs.compile(template);

		callback(null, _handler);
	})
}; // end export function