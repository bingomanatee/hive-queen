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
					hives:    {
						phi:      {
							resources: {
								mixin: [
									'ethel',
									'merman'
								]
							},
							actions: [
								{name:        'bob',
									resources: {
										model: [
											{name: 'apples'},
											{
												name: 'bakers',
												model_type: 'hive_model'
											},
											{
												name: 'cannibals',
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
			q.spawn(resources_root, config, function () {

				return	t.end();

				var edited_frames = 'spawn_site_with_single_frame_with_single_hive_and_two_actions_edited/frames';
				var comp_root = path.resolve(root, 'spawn_site_with_single_frame_with_single_hive_and_two_actions', 'frames');
				var comp_edited_root = path.resolve(root, edited_frames);

				compare_dirs(frame_root, comp_root, t, function () {
					var action_path = 'alpha/hives/phi/actions/bob';
					var pa = path.resolve(comp_edited_root, action_path);
					var pb = path.resolve(frame_root, action_path);
					if (_DEBUG) console.log("\n\n COPYING %s \n\nto %s \n\n", pa, pb);

					dcopy(
						{
							src:  pa,
							dest: pb
						},

						function (err) {
							if (err) {
								throw err;
							}
							compare_dirs(frame_root, comp_edited_root, t, function () {

								q.spawn(frame_root, config, function () {
									compare_dirs(frame_root, comp_edited_root, t, function () {
										rmdir(frame_root, function () {
											t.end();
										})
									});
								});
							}, 'comparing copied dirs - BEFORE running spawn again');
						});

				}, 'test single frame spawn comparison');
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
