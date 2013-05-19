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

var run_test   = [, 0, 0, 0, 1];
var save_files = [, 0, 0, 0, 1];
/* ************************* TESTS ****************************** */

/**
 * TEST 1
 *  - one frame with config
 *  - one hive with configs
 *  - no actions
 */
if (run_test[1]) {
	tap.test('test_parsers_1', function (t) {
		var scan_def = require(path.resolve(root, 'configs/test_parsers_1.json'));
		var write_dir = path.resolve(root, 'output/test_parsers_1');
		var exp_dir = path.resolve(root, 'expectations/test_parsers_1');

		function _tests() {

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

/**
 * TEST 2
 *  - one frame with config
 *  - two hive with configs
 *  - no actions
 */
if (run_test[2]) {
	tap.test('test_parsers_2', function (t) {
		var name = 'test_parsers_2';
		var scan_def = require(path.resolve(root, 'configs/' + name + '.json'));
		var write_dir = path.resolve(root, 'output/' + name);
		var exp_dir = path.resolve(root, 'expectations/' + name);

		function _tests() {

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

/**
 * TEST 3
 *  - one frame with config
 *  - two hive with configs
 *  - no actions
 */
if (run_test[3]) {
	tap.test('test_parsers_3', function (t) {
		var name = 'test_parsers_3';
		var scan_def = require(path.resolve(root, 'configs/' + name + '.json'));
		var write_dir = path.resolve(root, 'output/' + name);
		var exp_dir = path.resolve(root, 'expectations/' + name);

		function _tests() {

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

/**
 * TEST 4
 *  - one frame with config
 *  - one hive with config and actions
 *  - no actions
 */

if (true) {
	tap.test('test_parsers_4', function (t) {
		var name = 'test_parsers_4';
		var scan_def = require(path.resolve(root, 'configs/' + name + '.json'));
		var write_dir = path.resolve(root, 'output/' + name);
		var exp_dir = path.resolve(root, 'expectations/' + name);

		function _tests() {

			queen.frames_parser(write_dir)
				.then(function (parser) {
					parser.parse(scan_def, function () {

						if (save_files[4]) return t.end();

						var dd = new ndd.Dir_Diff(
							[
								exp_dir,
								write_dir
							],
							'full'
						);

						dd.compare(function (err, result) {
							t.equal(result.deviation, 0, 'no deviations in expectations');
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