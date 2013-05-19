var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var parser = require('hive-parser');
var config_handler = require('./../handlers/config');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	//return hives_handler(path.resolve(root, 'hives'))
	//	.then(function (handler_hives) {
			return config_handler(path.resolve(root))
				.then(function (handler_config) {
					return parser.Parser([ handler_config]);
				}, function (err) { throw err; })
	/*	}, function (err) {
			console.log('----------- error on hives parser', err);
			throw err;
		})*/
} // end export function