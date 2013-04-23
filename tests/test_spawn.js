var tap = require('tap');
var path = require('path');
var fs = require('fs');
var util = require('util');
var chai = require('chai');
var rmdir = require('rmdir');
var _ = require('underscore');
var q = require('./../lib/index');
var Gate = require('gate');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */
var root = path.resolve(__dirname, '../test_resources');
var frame_root = path.resolve(root, 'spawn_site/frames');
var scripts = {};
var _DEBUG_CD = false;

/* ************************* TESTS ****************************** */

function _test_suite() {

	//@TODO: use filecompare

	function compare_dirs(a, b, t, cb, msg){
		if (_DEBUG_CD) console.log("start comparing \n   %s \n   %s", a, b);
		var gate = Gate.create();
		var lg = gate.latch();

		gate.await(function(){
			if (_DEBUG_CD) console.log('done comparing %s and %s', a, b);
			cb();
		});

		fs.readdir(a, function(err, a_contents){
			if (err) throw err;
			fs.readdir(b, function(err, b_contents){
				if (err) throw err;
				t.same(a_contents, b_contents,  util.format(
					'directory %s is the same as directory %s', a, b) + (msg || ''));

				b_contents.forEach(function(b_file){
					var a_path = path.resolve(a, b_file);
					var b_path = path.resolve(b, b_file);

					var gate2 = Gate.create();
					var la = gate2.latch();
					var lb = gate2.latch();
					var l2g = gate.latch();

					var as, bs;
					fs.stat(b_path, function(err, stat){
						as = stat;
						la();
					});

					fs.stat(a_path, function(err, stat){
						bs = stat;
						lb();
					});

					gate2.await(function(){
						if (as.isDirectory() && bs.isDirectory()){
							compare_dirs(a_path, b_path, t, gate.latch(), msg);
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
				compare_dirs(frame_root, path.resolve(root, 'spawn_site_1', 'frames'), t, function(){
					rmdir(frame_root, function(){
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
				compare_dirs(frame_root, path.resolve(root, 'spawn_site_with_single_frame_with_single_hive', 'frames'), t, function(){
					return t.end();
					rmdir(frame_root, function(){
						t.end();
					})
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
