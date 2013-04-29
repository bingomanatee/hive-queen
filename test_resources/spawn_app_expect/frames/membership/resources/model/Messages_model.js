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
			name:    'Messages',
			_pk:     'id',
			data:    [{"id":1,"from":"moe","to":"steve","title":"welcome to my site","message":"I have granted you blogging permissions"}]
		});

		cb(null, model);

}; // end export function