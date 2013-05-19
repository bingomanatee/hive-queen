var _ = require('underscore');
var util = require('util');
var gate = require('gate');

module.exports = {

	/**
	 * if you want to package your JSON in a
	 * particular format, do it here.
	 */

	_send_JSON: function(context, cb, method){
		context.$send(cb);
	},

	_model: function(){
		return this.model('Members_ACL');
	},

	/**
	 * this is the name of the primary key
	 */
	_key_name: function(){
		
		return '_id';
		
	},

	/**
	 * this is the name of the url parameter
	 * in which IDs are passed into the action.
	 * usually but not always the same as the _key_name().
	 */

	_url_param_name: function(){
		
		return this._key_name();
		
	},

	/* *********** GET RESPONSES ************** */

	on_get_validate: function(context, cb){
		var self = this;

		if (!context.hasOwnProperty(this._url_param_name())){
			cb(new Error('cannot find ' + this._url_param_name() + ' in request'));
		} else {
			cb();
		}

	},

	on_get_input: function(context, cb){
		var self = this;
		this._model().findById(context[this._url_param_name()], function(err, record){
			if (err) return cb(err);
			context.$out = record;
			cb();
		})
	},

	on_get_process: function(context, cb){
		var self = this;

		cb();
	},

	on_get_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'get')
	},

	/* *********** PUT RESPONSES ************** */

	on_put_validate: function(context, cb){
		var self = this;

		if (!context.hasOwnProperty(this._url_param_name())){
			cb(new Error('cannot find ' + this._url_param_name() + ' in request to update'));
		} else {
			cb(null, context);
		}

	},

	on_put_input: function(context, cb){

		this._model().get(context[this._url_param_name()], function(err, record){
			if (err) return cb(err);
			context.$out = record;
			cb(null, context);
		})

	},

	/**
	 * note - this generic template assumes you only want to update
	 * the fields in the record that were originally present.
	 * Use more specific updating methods for application specific updating
	 */

	on_put_process: function(context, cb){
		var self = this;
		_.keys(context.$out.toJSON()).forEach(function(key){
			if (key == '_id') return;
			if (context.hasOwnProperty(key)){
				context.$out[key] = context[key];
			}
		});

		context.$out.save(cb);
		
	},
	on_put_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'put')
	},

	/* *********** POST RESPONSES ************** */

	on_post_validate: function(context, cb){
		var self = this;
		// there are no qualifiers for new records
		cb(null, context);
	},

	on_post_input: function(context, cb){
		var self = this;
		// no existing record to work with
		cb(null, context);
	},

	on_post_process: function(context, cb){
		var self = this;
		var data = {};

		throw new Error('!!!!!!must populate new record here!!!!!!');

		var record = new (this._model())(data);
		record.save(function(err){
		   context.$out = record;
		   cb(err);
		});

		context.$out.save(cb);
		
		cb(null, context);
	},

	on_post_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'put')
	},

	/* *********** DELETE RESPONSES ************** */

	on_delete_validate: function(context, cb){
		var self = this;

		if (!context.hasOwnProperty(this._url_param_name())){
			cb(new Error('cannot find ' + this._url_param_name() + ' in request'));
		} else {
			cb();
		}
	},

	on_delete_input: function(context, cb){
		var self = this;
		this._model().findById(context[this._url_param_name()], function(err, record){
			if (err) return cb(err);
			context.$out = record;
			cb();
		})
		
	},

	on_delete_process: function(context, cb){
		var self = this;
		context.$out.remove(cb);
	},

	on_delete_output: function(context, cb){
		var self = this;

		cb();
	}
}