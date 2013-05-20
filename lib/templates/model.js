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

	default: %>
		var model = [];

		cb(null, model);
			<%
			} %>
} // end export function