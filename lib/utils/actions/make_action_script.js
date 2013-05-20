var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var mkdirp = require('mkdirp');

var single_method_factory = require('./single_method');
var multi_method_factory = require('./multi_method');
var action_factory = require('./action_factory');

/* ************************************
 * Writes an action script (if none exists);
 * ************************************ */

/* ******* CLOSURE ********* */
var _afn = _.template('<%= root %>/<%= prefix %>_action.js');

/* ********* EXPORTS ******** */

module.exports = function (params, action_root, prefix, done) {
if (_DEBUG)	console.log('writing action script prefix %s in %s', prefix, action_root);
	var write_path = _afn({root: action_root, prefix: prefix});
	if (_DEBUG)	console.log('write path:%s', write_path);
	var dirname = path.dirname(write_path);
	if (_DEBUG)	console.log('making dir %s', dirname)
	mkdirp(dirname, function (err) {
		if (err){
			console.log('err making dir %s: %s', dirname, err);
			throw err;
		}
		action_factory(function (err, action_method) {
			var template_params = {
			};

			var text = action_method(_.extend(template_params, params));
			if (_DEBUG)console.log('text of action: %s', text.substring(0, 50));
			fs.writeFile(write_path, text, function(err){
				if (err){
					console.log('err writing action script: ', err);
					throw err;
				} else {
					done();
				}
			});
		})
	})
} // end export function