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
	
		model = apiary.Model({
		name:    'alpha',
		_pk:     'id'
		}
	);

	cb(null, model);
		
}; // end export function