var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var queen = require('./../lib/index')

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var root = path.resolve(__dirname, '../test_resources');

/* ************************* TESTS ****************************** */

if (true) {
	tap.test('parser scanning', function (t) {
		var scan_def = require(path.resolve(root, 'configs/spawn/spawn_2.json'));
		queen.frames_parser(path.resolve(root, 'spawn_site_2'))
			.then(function (parser) {
				parser.parse(scan_def, function () {
					t.end();
				});
			});
	});// end tap.test 1
}

if (false) {
	tap.test('test 2', function (t) {
		t.end();
	}) // end tap.test 2
}
	 