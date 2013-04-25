var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

module.exports = function (apiary, cb) {

	var helper = {
		name: 'fred',

		test: function (ctx, output) {
			return true;
		},

		weight: '0',

		respond: function (ctx, output, cb) {

			cb(null, ctx, output);
		}
	};

	cb(null, helper);
};