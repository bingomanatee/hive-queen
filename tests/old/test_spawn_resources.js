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
	var config = require(path.resolve(root, 'configs/test_spawned_app.json'));

	tap.test('test resources', function (t) {
		q.spawn(frame_root, config, function () {

			new ndd.Dir_Diff([frame_root, resources_root]).compare(function (err, report) {
				t.equal(report.deviation, 0, 'spawned_resources');
				rmdir(frame_root, _.bind(t.end, t));

			}, 'test resource spawning');
		})
	}); // end tap.test 2
}

mkdirp(frame_root, function () {
	rmdir(frame_root, function (err, dirs, files) {
		_test_suite();

	})
});