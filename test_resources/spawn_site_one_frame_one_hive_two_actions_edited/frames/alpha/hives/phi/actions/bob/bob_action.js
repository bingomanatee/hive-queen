var _ = require('underscore');
var util = require('util');
var gate = require('gate');

module.exports = {

	/* *********** GET RESPONSES ************** */

	on_get_validate: function(context, cb){
		var self = this;

		console.log('i am a modified action');

		cb();
	},

	on_get_input: function(context, cb){
		var self = this;

		cb();
	},

	on_get_process: function(context, cb){
		var self = this;

		cb();
	},

	on_get_output: function(context, cb){
		var self = this;

		cb();
	}


}