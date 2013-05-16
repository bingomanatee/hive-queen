var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var hive_parser = require('hive-parser');
var hives_handler = require('./../handlers/hives');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return hives_handler(root)
		.then(function(hives_handler){
			return hive_parser.Parser([hives_handler]);
		})
} // end export function