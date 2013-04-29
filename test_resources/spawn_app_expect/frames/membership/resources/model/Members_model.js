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
			name:    'Members',
			_pk:     'id',
			data:    [{"id":1,"member_name":"moe","password":"chowderhead"},{"id":2,"member_name":"steve","password":"2wildandcrazyguys"}]
		});

		cb(null, model);

}; // end export function