var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
	<% switch (model_type){
		case 'hive_model': %>
		model = apiary.Model({
		name:    '<%= name %>',
		_pk:     '<%= pk %>'
		}
	);

	cb(null, model);
		<%
		break;

	case 'hive_model_mongoose': %>
	Mongoose_Model(
		{
			name: '<%= name %>'
		}
		, {
			mongoose:   apiary.get_config('mongoose'),
			schema_def: <%- JSON.stringify(schema) %>
			},
		apiary.dataspace,
		cb);
<%  break;

	default: %>
		var model = [];

		cb(null, model);
			<%
			} %>
}; // end export function