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
			name:    'Members_ACL',
			_pk:     'id',
			data:    [{"id":1,"member":"moe","permission":"send_messages"},{"id":2,"member":"steve","permission":"blog"}]
		});

		cb(null, model);

}; // end export function