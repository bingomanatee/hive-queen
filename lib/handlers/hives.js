var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
// thsi is the parsing library
var hive_parser = require('hive-parser');
// this is a specific parser
//var hiveParser = require('./../parsers/hive');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (root) {
	return hive_parser.Handler(function(params){
		console.log('found hives at root %s: %s', root, util.inspect(params.value));
		//@TODO: parse hive
	}, 'hives');
}; // end export function