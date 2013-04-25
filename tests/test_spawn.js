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

	if (false) {
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

	if (false) {
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

	if (false) {
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

	if (false) {
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

		tap.test('test single_frame with single hive and two actions', function (t) {
			var ang_frames = 'spawn_site_with_angular_actions';
			var comp_root = path.resolve(root, ang_frames, 'frames');
			q.spawn(comp_root, config, function () {

				return t.end();

				compare_dirs(frame_root, comp_root, t, function () {
					t.end();
				}, 'created angular action');
			})
		}); // end tap.test 2
	}

	if (true) {
		var config = {
			frames: {
				membership: {
					hives: {
						members: {
							actions: [
								{
									name: 'member_rest',
									rest: true,
									model_name: 'Members'
								},
								{
									name: 'acl',
									rest: true,
									model_type: 'mongoose',
									model_name: 'Members_ACL'
								},

								{
									name: 'messages',
									rest: true,
									model_type: 'hive_model',
									model_name: 'Messages'
								}
							]
						}
					}
				}
			}

		};

		if (false){

		tap.test('test rest spawners', function (t) {
			var rest_path = 'spawn_rest';
			var comp_root = path.resolve(root, rest_path, 'frames');
			q.spawn(comp_root, config, function () {

				return t.end();

				compare_dirs(frame_root, comp_root, t, function () {
					t.end();
				}, 'created rest actions');
			})
		}); // end tap.test 2
	}

		if (true){
			tap.test('test rest application', function(t){

				require(path.resolve(root, 'spawn_rest/app'))(function(err, apiary){
					setTimeout(function(){

					}, 1000);
				});
			})
		}
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
