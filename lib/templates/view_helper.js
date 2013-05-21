var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

module.exports = function (apiary, cb) {

	var helper = {
		name: '<%= name %>',

		test: function (ctx, output) {
			return true;
		},

		weight: <%= weight %>,

		respond: function (ctx, output, cb) {

		}
	};

	cb(null, helper);
};