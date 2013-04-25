var tap = require('tap');
var Mongoose_Model = require('hive-model-mongoose');

module.exports = function (apiary, cb) {

	Mongoose_Model(
		{
			name: '<%= name %>'
		}
		, {
			mongoose:   apiary.get_config('mongoose'),
			schema_def: <%= JSON.stringify(schema) %>
		},
		apiary.dataspace,
		cb);
};