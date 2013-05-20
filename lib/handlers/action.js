var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var mkdirp = require('mkdirp');
var action_parser = require('./../parsers/action');
var make_action_script = require('./../utils/actions/make_action_script');
var make_view_template = require('./../utils/actions/make_view_template');

/* ************************************
 * This handler responds to the a single ACTION node
 * ACTION nodes can contain a variety of content including
 *  - an Action Script named [actionName]_action.js | [actionName]Action.js
 *  - a configuration file
 *  - a static folder
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {

	function _on_handle(params) {
		var action_root = path.resolve(root, params.key);
		if (_DEBUG) console.log('ACTION HANDLER found action %s at key %s: making root %s', JSON.stringify(params.value, true, 2), params.key, action_root);
		make_action_script(params, action_root, params.key, params.gate.latch());
		make_view_template(params, action_root, params.key, params.gate.latch());
		var l = params.gate.latch();
		return action_parser(action_root).then(function (parser) {
			mkdirp(action_root, function () {
				parser.parse(params.value, l);
			});
		}, function (err) { throw err; })
	}

	return parser.Handler(_on_handle);
}; // end export function