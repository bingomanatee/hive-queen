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
var ndd = require('node-dir-diff');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var root = path.resolve(__dirname, '../test_resources');
var frame_root = path.resolve(root, 'spawn_site/frames');

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

	//@TODO: use filecompare

	if (true) {
		tap.test('test single frame spawn', function (t) {
			q.spawn(frame_root, {
				frames: {
					alpha: {}
				}

			}, function () {
				new ndd.Dir_Diff(
					[frame_root, path.resolve(root, 'spawn_site_single_frame', 'frames')]
					, 'full'
				).compare(function (err, report) {
					t.equal(report.deviation, 0, 'single frame content matches expectations');
					rmdir(frame_root, function () {
						t.end();
					})
				}, 'test single frame spawn comparison');
			})
		}) // end tap.test 1
	}

	if (true) {
		tap.test('test single_frame with single hive', function (t) {
			q.spawn(frame_root, {
				frames: {
					alpha: {
						hives: {
							phi: {

							}
						}
					}
				}

			}, function () {

				new ndd.Dir_Diff([frame_root, path.resolve(root, 'spawn_site_with_single_frame_with_single_hive', 'frames')]).
					compare(function (err, report) {
						t.equal(report.deviation, 0, 'spawned site meets expectations');
					rmdir(frame_root, function () {
						t.end();
					})
				}, 'test single frame spawn comparison');
			})
		}); // end tap.test 2
	}

	if (true) {
		var config = {
			frames: {
				alpha: {
					hives: {
						phi: {
							actions: [
								'bob',
								'ray'
							]
						}
					}
				}
			}

		};

		var base_name = 'spawn_site_one_frame_one_hive_two_actions';
		var edited_frames = base_name + '_edited';
		var comp_root = path.resolve(root, base_name, 'frames');
		var comp_edited_root = path.resolve(root, edited_frames, 'frames');

		tap.test('repeated execution preserving edits', function (t) {

			q.spawn(frame_root, config, function () {

				if (_DEBUG) console.log("comparing %s and \n %s", frame_root, comp_root);
				new ndd.Dir_Diff([frame_root, comp_root], 'full').compare(function (err, report) {
					t.equal(report.deviation, 0, 'spawn and one hive two action the same');
					var action_path = 'alpha/hives/phi/actions/bob';
					var pa = path.resolve(comp_edited_root, action_path);
					var pb = path.resolve(frame_root, action_path);
					if (_DEBUG || 1) console.log("\n\n COPYING %s \n\nto %s \n\n", pa, pb);

					dcopy(
						{
							src:  pa,
							dest: pb
						},

						function (err) {
							if (err) {
								throw err;
							}
							new ndd.Dir_Diff([frame_root, comp_edited_root]).compare(function (err, report) {
								t.equal(report.deviation, 0, 'copying the edited directory shuold make the spawn site the same as the edited expectation');
								q.spawn(frame_root, config, function () {
									new ndd.Dir_Diff([frame_root, comp_edited_root]).compare(function (err, report) {
										t.equal(report.deviation, 0, 'the edited files should not have been overridden by a re-spawn');

										rmdir(frame_root, function () {
											t.end();
										})
									});
								});
							}, 'comparing copied dirs - BEFORE running spawn again');
						});

				});
			})
		}); // end tap.test 2
	}

	if (true) {
		var config = {
			frames: {
				alpha: {
					hives: {
						phi: {
							actions: [
								{name:       'bob',
									angular: {
										controller: 'FooController'
									}
								},
								{
									name:    'ray',
									angular: {
										controller: {
											name: 'Albert'
										},
										app:        {
											name: 'Brooks',
											deps: [
												'ui', 'foo', 'bar']
										}
									}
								}
							]
						}
					}
				}
			}

		};

		tap.test('test angular enabled action', function (t) {
			var ang_frames = 'spawn_site_with_angular_actions';
			var comp_root = path.resolve(root, ang_frames, 'frames');
			q.spawn(frame_root, config, function () {

				new ndd.Dir_Diff([frame_root, comp_root], 'full').compare(function (err, report) {
					t.equal(report.deviation, 0, 'after spawning with angular');
					t.end();
				}, 'created angular action');
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
