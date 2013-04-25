var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Gate = require('gate');
var mkdirp = require('mkdirp');
var _DEBUG = false;
var ejs = require('ejs');

/* ************************************
 * creates static directories
 * ************************************ */

var model_resource_template = path.resolve(__dirname, './templates/model_resource.js');

/* ******* CLOSURE ********* */

function _make(tmpl, template_path, file_path, config, cb) {
	console.log('_make: file path %s, config %s', file_path, util.inspect(config));

	if (!tmpl) {
		fs.readFile(template_path, 'utf8', function (err, template) {
			tmpl = ejs.compile(template);
			fs.writeFile(file_path, tmpl(config), 'utf8', cb);
		})
	} else {
		fs.writeFile(file_path, tmpl(config), 'utf8', cb);
	}
	return tmpl;
}
var hive_model_resource_template = path.resolve(__dirname, './templates/hive_model_resource.js');

var hmm_template;
function make_hive_mongoose_model(file_path, config, cb) {
	var vconfig = _.extend({schema: {}},
	config
	);
	hmm_template = _make(hmm_template, hive_model_mongoose_resource_template, file_path, vconfig, cb);
}
var hive_model_mongoose_resource_template = path.resolve(__dirname, './templates/hive_model_mongoose_resource.js');

var hm_template;
function make_hive_model(file_path, config, cb) {

	var vconfig = _.extend({
		'primary_key': 'id'
	}, config);
	hm_template = _make(hm_template, hive_model_resource_template, file_path, vconfig, cb);
}

var m_template;
function make_model(file_path, config, cb) {
	m_template = _make(m_template, model_resource_template, file_path, config, cb);
}

var mixin_resource_template = path.resolve(__dirname, './templates/mixin_resource.js');
var mixin_template;
function make_mixin(file_path, config, cb) {
	mixin_template = _make(mixin_template, mixin_resource_template, file_path, config, cb);
}

var view_helper_resource_template = path.resolve(__dirname, './templates/view_helper_resource.js');
var view_helper_template;
function make_view_helper(file_path, config, cb) {
	var vconfig = _.extend({
		weight: 0
	}, config);
	view_helper_template = _make(view_helper_template, view_helper_resource_template, file_path, vconfig, cb);
}

/* ********* EXPORTS ******** */

module.exports = function (root_dir, config, type, cb) {
	console.log('resource type: %s, config: %s', type, util.inspect(config));

	if (!config) {
		return cb();
	}

	if (!_.isArray(root_dir)) {
		root_dir = root_dir.split('/');
	}

	if (_.isString(config)) {
		config = {
			name: config
		}
	}

	var resource_path = path.resolve(root_dir.join('/'), config.name + '_' + type + '.js');

	switch (type) {
		case 'model':

			switch (config.model_type) {
				case 'hive_mongoose_model':
					make_hive_mongoose_model(resource_path, config, cb);
					break;

				case 'hive_model':
					make_hive_model(resource_path, config, cb);
					break;

				default:
					make_model(resource_path, config, cb);
			}

			break;


		case 'view_helper':
			make_view_helper(resource_path, config, cb);
			break;

		case 'mixin':

			make_mixin(resource_path, config, cb);

			break;

		default:
			console.log('cannot understand type %s', type);
			cb();
	}

}; // end export function