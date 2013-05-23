var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var queen = require('./../lib/index');
var ndd = require('node-dir-diff');
var rmdir = require('rmdir');
var fs = require('fs');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var root = path.resolve(__dirname, '../test_resources');

// NOTE - IF YOU DON'T compare_files, save_output is automatically true

var run_tests = [, 1, 1, 1, 1, 1];
var compare_files = [, 1, 1, 1, 1, 1];
var save_output =[]; //[, 1, 1, 1, 1, 1];

/* ************************* TESTS ****************************** */

_.each(_.range(1, 6), function (index) {

	if (run_tests[index]) {
		tap.test('test_parsers_' + index, function (t) {
			var name = 'test_parsers_' + index;
			var scan_def = require(path.resolve(root, 'configs/' + name + '.json'));
			var write_dir = path.resolve(root, 'output/' + name);
			var exp_dir = path.resolve(root, 'expectations/' + name);

			function _tests() {

				queen.frames_parser(write_dir)
					.then(function (parser) {
						parser.parse(scan_def, function () {

							if (!compare_files[index])return t.end();

							var dd = new ndd.Dir_Diff(
								[
									exp_dir,
									write_dir
								],
								'full'
							);

							dd.compare(function (err, result) {
								t.equal(result.deviation, 0, 'no deviations in expectations');
								if (save_output[index]) return t.end();
								rmdir(write_dir, function () {
									t.end();
								})
							});
						});
					});
			}

			fs.exists(write_dir, function (exists) {
				if (exists) {
					rmdir(write_dir, _tests);
				} else {
					_tests();
				}
			})
		});// end tap.test 1
	}

});