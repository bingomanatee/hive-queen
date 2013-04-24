var tap = require('tap');
var path = require('path');
var fs = require('fs');
var util = require('util');
var chai = require('chai');
var rmdir = require('rmdir');
var _ = require('underscore');
var q = require('./../lib/index');
var Gate = require('gate');
var copy = require('dank-copyfile');
var filecompare = require('filecompare');
var dcopy = require('directory-copy');
var jsdiff = require('diff');
var mkdirp = require('mkdirp');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var root = path.resolve(__dirname, '../test_resources');
var frame_root = path.resolve(root, 'spawn_site/frames');
var scripts = {};
var _DEBUG_CD = false;

/* ************************* TESTS ****************************** */

function stats(files, cb){
	var gate = gate.create();

	var out = {};

	files.forEach(function(file){
		var fl = gate.latch();
		fs.stat(file, function(err, stat){
			out[file] = stat;
			fl();
		});
	});

	gate.await(function(){
		cb(null, out);
	});
}

/* function dcopy(config, cb){
	var gate = Gate.create();

	fs.readdir(config.src, function (err, contents) {
		contents.forEach(function(file){
			var asl = gate.latch();

			var a_path = path.resolve(config.src, file);
			var b_path = path.resolve(config.dest, file);

			fs.stat(a_path, function(err, fstats){
				if (fstats.isFile()){
					copy(a_path, b_path, asl);
				} else {
					if (fstats.isDirectory()){
						mkdirp(b_path, function(){
							dcopy({src: a_path, dst: b_path}, asl);
						});
					}
				}
			});
		})
		gate.await(cb);
	});
} */

function _test_suite() {

	//@TODO: use filecompare

	function compare_dirs(a, b, t, cb, msg) {
		if (!msg) msg = '';

		function _r(a){
			if (root){
				return a.replace(root, '');
			} else {
				return a;
			}
		}

		if (_DEBUG_CD) console.log("start comparing \n   %s \n   %s", _r(a), _r(b));
		var gate = Gate.create();
		var lg = gate.latch();

		gate.await(function () {
			if (_DEBUG_CD) console.log('done comparing %s and %s', _r(a), _r(b));
			cb();
		});

		fs.readdir(a, function (err, a_contents) {
			if (err) throw err;
			fs.readdir(b, function (err, b_contents) {
				if (err) throw err;
				t.same(a_contents, b_contents, util.format(
					'directory %s files == directory %s files', _r(a), _r(b)) + (msg || ''));

				b_contents.forEach(function (b_file) {
					var a_path = path.resolve(a, b_file);
					var b_path = path.resolve(b, b_file);

					var gate2 = Gate.create();
					var la = gate2.latch();
					var lb = gate2.latch();
					var l2g = gate.latch();

					var as, bs;
					fs.stat(b_path, function (err, stat) {
						as = stat;
						la();
					});

					fs.stat(a_path, function (err, stat) {
						bs = stat;
						lb();
					});

					gate2.await(function () {
						t.ok(
							(as.isDirectory() == bs.isDirectory()) && (as.isFile() == bs.isFile()),
							msg + ': ' + _r(a_path) + ' is not the same type(file/dir) as ' + _r(b_path)
						);

						if (as.isDirectory() && bs.isDirectory()) {
							compare_dirs(a_path, b_path, t, gate.latch(), msg);
						} else if (as.isFile() && bs.isFile()) {
							var gl = gate.latch();
							filecompare(a_path, b_path, function (isEqual) {

								if (!isEqual) {
									console.log("\n file difference: ");
									var a = fs.readFileSync(a_path, 'utf8');
									var b = fs.readFileSync(b_path, 'utf8');

									var line_diff = jsdiff.diffLines(a, b);

									console.log('------- file diff ----------', a_path);
									console.log('diff: %s', util.inspect(line_diff));
									console.log('------- file A: %s ----------', a_path);
									console.log('------- file A: %s ----------', a_path);
									console.log(a);
									console.log("------- END FILE A: %s ----------", a_path);
									console.log('------- file B: %s ---------', b_path);
									console.log(b);
									console.log("------- END FILE B: %s ----------", b_path);
								}
								t.ok(isEqual, msg + ': ' + _r(a_path) + ' == ' + _r(b_path));

								gl();
							});
						}
						l2g();
					});
				});

				lg();
			})
		})
	}

	if (true) {
		tap.test('test single frame spawn', function (t) {
			q.spawn(frame_root, {
				frames: {
					alpha: {}
				}

			}, function () {
				compare_dirs(frame_root, path.resolve(root, 'spawn_site_single_frame', 'frames'), t, function () {
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
				compare_dirs(frame_root, path.resolve(root, 'spawn_site_with_single_frame_with_single_hive', 'frames'), t, function () {
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

		tap.test('test single_frame with single hive and two actions', function (t) {
			q.spawn(frame_root, config, function () {
				var edited_frames = 'spawn_site_with_single_frame_with_single_hive_and_two_actions_edited/frames';
				var comp_root = path.resolve(root, 'spawn_site_with_single_frame_with_single_hive_and_two_actions', 'frames');
				var comp_edited_root = path.resolve(root, edited_frames);

				compare_dirs(frame_root, comp_root, t, function () {
					var action_path = 'alpha/hives/phi/actions/bob';
					var pa = path.resolve(comp_edited_root, action_path);
					var pb = path.resolve(frame_root, action_path);
					console.log("\n\n COPYING %s \n\nto %s \n\n", pa, pb);

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
