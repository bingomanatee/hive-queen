var _ = require('underscore');
var util = require('util');
var gate = require('gate');

module.exports = {

	on_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_input: function(context, cb){
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
	}// ,

	/* *********** GET RESPONSES ************** */
/*
	on_get_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_get_input: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_get_process: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_get_output: function(context, cb){
		var self = this;

		cb(null, context);
	},
*/

	/* *********** PUT RESPONSES ************** */

/*
	on_put_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_put_input: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_put_process: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_put_output: function(context, cb){
		var self = this;

		cb(null, context);
	},
*/

	/* *********** POST RESPONSES ************** */

/*
	on_post_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_post_input: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_post_process: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_post_output: function(context, cb){
		var self = this;

		cb(null, context);
	},
*/

	/* *********** DELETE RESPONSES ************** */

/*
	on_delete_validate: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_delete_input: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_delete_process: function(context, cb){
		var self = this;

		cb(null, context);
	},

	on_delete_output: function(context, cb){
		var self = this;

		cb(null, context);
	}
*/

}