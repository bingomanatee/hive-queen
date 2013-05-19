var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var queen = require('./../lib/index');
var ndd = require('node-dir-diff');
var rmdir = require('rmdir');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var root = path.resolve(__dirname, '../test_resources');

/* ************************* TESTS ****************************** */

if (true) {
	tap.test('parser scanning', function (t) {
		var scan_def = require(path.resolve(root, 'configs/spawn/spawn_2.json'));
		var write_dir = path.resolve(root, 'output/spawn_site_2');
		var exp_dir = path.resolve(root, 'expectations/spawn_site_2');
		rmdir(write_dir, function () {

			queen.frames_parser(write_dir)
				.then(function (parser) {
					parser.parse(scan_def, function () {

						var dd = new ndd.Dir_Diff(
							[
								exp_dir,
								write_dir
							],
							'full'
						);

						dd.compare(function (err, result) {
							t.equal(result.deviation, 0, 'no deviations in expectations');
							rmdir(write_dir, function(){
								t.end();
							})
						});
					});
				});
		});
	});// end tap.test 1
}

if (false) {
	tap.test('test 2', function (t) {
		t.end();
	}) // end tap.test 2
}
	 