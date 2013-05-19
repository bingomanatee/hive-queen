var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var hive_handler = require('./../handlers/hive');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return hive_handler(root)
	.then(function(handler){
		return parser.Parser([handler]);
	}, function(err){ throw err; })
}; // end export function