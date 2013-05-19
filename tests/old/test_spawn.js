var tap = require('tap');
var path = require('path');
var fs = require('fs');
var util = require('util');
var chai = require('chai');
var rmdir = require('rmdir');
var _ = require('underscore');
var q = require('./../../lib/index');
var copy = require('dank-copyfile');
var dcopy = require('directory-copy');
var mkdirp = require('mkdirp');
var ndd = require('node-dir-diff');
var frame_1_path = 'spawn_site_1/frames';
var frame_2_path = 'spawn_site_2/frames';
var frame_3_path = 'spawn_site_3/frames';
var frame_4_path = 'spawn_site_4/frames';
var Gate = require('gate');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var root = path.resolve(__dirname, '../test_resources');

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
		tap.test('spawn 1: test single frame spawn', function (t) {
			var frame_root = path.resolve(root, frame_1_path);
			mkdirp(frame_root, function () {
				q.spawn(frame_root, {
					frames: {
						alpha: {}
					}

				}, function () {
					new ndd.Dir_Diff(
						[frame_root, path.resolve(root, 'spawn_1_expect', 'frames')]
						, 'full'
					).compare(function (err, report) {
							t.equal(report.deviation, 0, 'single frame content matches expectations');
							rmdir(frame_root, function () {
								t.end();
							})
						}, 'test single frame spawn comparison');
				})
			})
		}) // end tap.test 1
	}

	if (true) {
		tap.test('spawn 2: test single_frame with single hive', function (t) {
			var frame_root = path.resolve(root, frame_2_path);
			var frame_2_expect = path.resolve(root, 'spawn_2_expect', 'frames');

			q.spawn(frame_root, require(path.resolve(root,'configs/spawn/spawn_2.json')), function () {

				new ndd.Dir_Diff([frame_root, frame_2_expect]).
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

		tap.test('repeated execution preserving edits', function (t) {
			var frame_root = path.resolve(root, frame_3_path);
			mkdirp(frame_root, function () {

				var config = require(path.resolve(root, 'configs/spawn/preserve_edits.json'))

				var base_name = 'spawn_3_expect';
				var edited_frames = base_name + '_edited';
				var comp_root = path.resolve(root, base_name, 'frames');
				var comp_edited_root = path.resolve(root, edited_frames, 'frames');

				q.spawn(frame_root, config, function () {

					if (_DEBUG) console.log("comparing %s and \n %s", frame_root, comp_root);
					new ndd.Dir_Diff([frame_root, comp_root], 'full').compare(function (err, report) {
						t.equal(report.deviation, 0, 'spawn and one hive two action the same');
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
				});
			})
		}); // end tap.test 2
	}

	if (true) {

		tap.test('test angular enabled action', function (t) {
			var frame_root = path.resolve(root, frame_4_path);
			var ang_frames = 'spawn_4_expect';
			var comp_root = path.resolve(root, ang_frames, 'frames');
			mkdirp(frame_root, function () {

				var config = require(path.resolve(root, 'configs/spawn/angular.json'));
				q.spawn(frame_root, config, function () {

					new ndd.Dir_Diff([frame_root, comp_root], 'full').compare(function (err, report) {
						t.equal(report.deviation, 0, 'after spawning with angular');
						rmdir(frame_root, _.bind(t.end, t));
					}, 'created angular action');
				})
			})
		}); // end tap.test 2
	}
}

var dirs = [
	path.resolve(root, frame_1_path),
	path.resolve(root, frame_2_path),
	path.resolve(root, frame_3_path),
	path.resolve(root, frame_4_path)
];
var gate = Gate.create();

dirs.forEach(function (dir) {
	mkdirp(dir, gate.latch());

});

gate.await(function () {

	var gate2 = Gate.create();

	dirs.forEach(function (dir) {
		rmdir(dir, gate2.latch());
	});

	gate2.await(_test_suite)

});