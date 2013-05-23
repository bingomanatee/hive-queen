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
	
	Mongoose_Model(
		{
			name: 'foot'
		}
		, {
			mongoose:   apiary.get_config('mongoose'),
			schema_def: {"name":"String","created":"Date"}
			},
		apiary.dataspace,
		cb);

}; // end export function