var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var getCharlesFile = require('getCharlesFile');

/* ************************************
 * catches all un-treated API calls and returns the content of a given path
 * ************************************ */

/* ******* CLOSURE ********* */

var API_RE = /^\/(api\/([^\?]+))/;
var PARSE_AS_JSON = true;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	cb(null, {
		name:    'ethel',
		respond: function (callback) {
			callback();
		}
	});

}; // end export function