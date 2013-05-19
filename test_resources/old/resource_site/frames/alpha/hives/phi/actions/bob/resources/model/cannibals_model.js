var tap = require('tap');
var Mongoose_Model = require('hive-model-mongoose');

module.exports = function (apiary, cb) {

	Mongoose_Model(
		{
			name: 'cannibals'
		}
		, {
			mongoose:   apiary.get_config('mongoose'),
			schema_def: {}
		},
		apiary.dataspace,
		cb);
};