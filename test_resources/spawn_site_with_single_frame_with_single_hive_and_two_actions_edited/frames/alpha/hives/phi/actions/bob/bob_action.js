var _ = require('underscore');
var util = require('util');
var gate = require('gate');

module.exports = {

	/* *********** GET RESPONSES ************** */

	on_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_process: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_output: function(context, cb){
		var self = this;

		cb(null, context);
	}

}