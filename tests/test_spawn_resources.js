var tap = require('tap');
var path = require('path');
var fs = require('fs');
var util = require('util');
var chai = require('chai');
var rmdir = require('rmdir');
var _ = require('underscore');
var q = require('./../lib/index');
var copy = require('dank-copyfile');
var dcopy = require('directory-copy');
var mkdirp = require('mkdirp');
var compare_dirs = require('./../test_resources/node_modules/compare_dirs')

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var root = path.resolve(__dirname, '../test_resources');
var frame_root = path.resolve(root, 'spawn_site/frames');
var resources_root = path.resolve(root, 'resource_site/frames');

/* ************************* TESTS ****************************** */

function stats(files, cb) {
	var gate = gate.create();

	var out = {};

	files.forEach(function (file) {
		var fl = gate.latch();
		fs.stat(file, function (err, stat) {
			out[file] = stat;
			fl();
		});
	});

	gate.await(function () {
		cb(null, out);
	});
}

function _test_suite() {

	if (true) {
		var config = {
			frames: {
				alpha: {
					resources: {
						view_helper: [
							'fred',
							'barney'
						]
					},
					hives:     {
						phi: {
							resources: {
								mixin: [
									'ethel',
									'merman'
								]
							},
							actions:   [
								{name:         'bob',
									resources: {
										model: [
											{name: 'apples'},
											{
												name:       'bakers',
												model_type: 'hive_model'
											},
											{
												name:       'cannibals',
												model_type: 'hive_mongoose_model'
											}
										]
									}
								}
							]
						}
					}
				}
			}

		};

		tap.test('test resources', function (t) {
			q.spawn(frame_root, config, function () {

				compare_dirs(frame_root, resources_root, t, function () {
					rmdir(frame_root, _.bind(t.end, t));

				}, 'test resource spawning');
			})
		}); // end tap.test 2
	}
}

fs.exists(frame_root, function (exists) {
	if (exists) {
		rmdir(frame_root, function (err, dirs, files) {
			_test_suite();

		})
	} else {
		_test_suite();
	}
});
