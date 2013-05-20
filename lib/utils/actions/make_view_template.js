var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var mkdirp = require('mkdirp');

var single_method_factory = require('./single_method');
var multi_method_factory = require('./multi_method');
var template_factory = require('./template_factory');

/* ************************************
 * Writes an action script (if none exists);
 * ************************************ */

/* ******* CLOSURE ********* */
var _afn = _.template('<%= root %>/<%= prefix %>_view.html');

/* ********* EXPORTS ******** */

module.exports = function (params, action_root, prefix, done) {
if (_DEBUG)	console.log('writing action view prefix %s in %s', prefix, action_root);
	var write_path = _afn({root: action_root, prefix: prefix});
	if (_DEBUG)		console.log('write path:%s', write_path);
	var dirname = path.dirname(write_path);
	if (_DEBUG)	console.log('making dir %s', dirname)
	mkdirp(dirname, function (err) {
		template_factory(function (err, action_method) {
			var template_params = {
			};

			var text = action_method(_.extend(template_params, params));
			if (_DEBUG)			console.log('text of action: %s', text);
			fs.writeFile(write_path, text, done);
		})
	})
} // end export function