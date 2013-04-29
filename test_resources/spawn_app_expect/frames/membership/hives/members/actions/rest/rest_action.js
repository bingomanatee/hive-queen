var _ = require('underscore');
var util = require('util');
var gate = require('gate');

/** ****************************
 * MODEL: {
    "name": "Members",
    "model_type": "hive_model",
    "primary_key": "id",
    "data": [
        {
            "id": 1,
            "member_name": "moe",
            "password": "chowderhead"
        },
        {
            "id": 2,
            "member_name": "steve",
            "password": "2wildandcrazyguys"
        }
    ],
    "schema": [
        {
            "name": "member_name",
            "type": "string"
        },
        {
            "name": "password",
            "type": "string"
        }
    ]
}
 * ( hive_model )
 *
 * NOTE - this script assumes that "non-truthy" ids - blank strings, zero, null --
 * are not legitimate keys for storing data in your repo.
 * If this is not true adjust the script accordingly.
 *
 * **************************** */

module.exports = {

	/**
	 * if you want to package your JSON in a
	 * particular format, do it here.
	 */

	_send_JSON: function(context, cb, method){
		context.$send(cb);
	},

	_model: function(){
		return this.model('Members');
	},

	_id_from_context: function(context, data){
		var id;

		id = context[this._url_param_name()];

		if (!id) {
			id = context[this._key_name()];
		}
		if (!id && data) {
			id = this._model()._make_pk(data);
		}
		return id;
	},

	_record_from_context: function (context){

		var data = {};
 		// console.log('getting data from context %s', util.inspect(context, false, 0));
			data['member_name'] = context['member_name'];
			data['password'] = context['password'];
 		return data;
	},

	/**
	 * this is the name of the primary key
	 */
	_key_name: function(){
		
		return this._model()._pk;
		
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

		cb();
	},

	on_get_input: function(context, cb){
		var self = this;
<!-- model_type: hive_model -->
		var id =  this._id_from_context(context);
		
		if (!id){
		
			context.$out = this._model().all().records();
			return cb();
		
		}
		this._model().get(id, function(err, record){
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
		var id =  this._id_from_context(context);
		
		if(!id) {
			console.log('warning - no ID in URL');
		}
		cb();
		
	},

	on_put_input: function(context, cb){
		var data = this._record_from_context(context);
		var id = this._id_from_context(context, data);
		data[this._key_name()] = id;
		context.$out = data;
		
 		cb();
	},

	on_put_process: function(context, cb){
		var self = this;
		this._model().put(context.$out, function(err, record){
			if (err) {
			 	cb(err)
			} else {
				context.$out = record;
				cb();
			}
		});
	},
	on_put_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'put')
	},

	/* *********** POST RESPONSES ************** */

	on_post_validate: function(context, cb){
		var self = this;
		//@TODO: validate content
		cb();
	},

	on_post_input: function(context, cb){
		var data = this._record_from_context(context);
		context.$out = data;
		var id =  this._id_from_context(context, data);

		if (!id){
			return cb(new Error('must inject record ID with hive-model models;'));
		}
		data[this._key_name()] = id;
		context.$out = data;
		cb();
	},

	on_post_process: function(context, cb){
		var self = this;
		this._model().put(context.$out, function(err, record){
			if (err) {
			 	cb(err)
			} else {
				context.$out = record;
				cb();
			}
		});
		cb(null, context);
	},

	on_post_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'put')
	},

	/* *********** DELETE RESPONSES ************** */

	on_delete_validate: function(context, cb){
		var self = this;
		var id = this._id_from_context(context);

		console.log('odvid: %s', id);

		if (!id){
			cb(new Error('cannot find primary in request to delete'));
		} else {
			cb();
		}
	},

	on_delete_input: function(context, cb){
		var self = this;
		var id = this._id_from_context(context);
		this._model().get(id, function(err, record){
			if (err) return cb(err);
			context.$out = record;
			cb();
		})
		
	},

	on_delete_process: function(context, cb){
		var self = this;
		this._model().delete(context.$out, function(err, record){
			console.log('deleting %s: record %s', util.inspect(context.$out), util.inspect(record));
			if (err) {
			 	cb(err)
			} else {
				context.$out = record;
				cb();
			}
		});
	},

	on_delete_output: function(context, cb){
		var self = this;

		this._send_JSON(context, cb, 'delete')
		cb();
	}
}