var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

/* ************************************
 * This model maintains an in-memory collection.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

		var model = apiary.Model({
			name:    '<%= name %>',
			_pk:     '<%= primary_key %>',
			data:    <%= JSON.stringify(data) %>
		});

		cb(null, model);

}; // end export function