var Gate = require('gate')
	, _ = require('underscore')
	, util = require('util')
	, path = require('path')
	, fs = require('fs')
	, _DEBUG = false;

module.exports = function (apiary, cb) {
	cb(null, {
		name:    '<%= name %>',
		respond: function (done) {

			function frame_mixin(frame) {
				/**
				 * the contents of this mixin will be applied
				 * to all loaded and future frames
				 * before the application is considered "ready".
				 *
				 * Similar handlers (on_action, on_hive) exist
				 * for other constructs.
				 *
				 * Also, methods and other modifications
				 * can be added directly to the apiary
				 * singleton itself.
				 */
			}

			apiary.on_frame(frame_mixin);
			done();
		}
	})
};