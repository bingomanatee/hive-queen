var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var root = path.resolve(__dirname, '../test_resources');
var compare_dirs = require(path.resolve(root, 'node_modules/compare_dirs'));

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */


/* ************************* TESTS ****************************** */

if (true) {
	tap.test('empty and non empty directories', function (t) {
		var path_1 = path.resolve(root, 'compare_tests/t1/a');
		var path_2 = path.resolve(root, 'compare_tests/t1/b');
		var path_3 = path.resolve(root, 'compare_tests/t1/c');

		compare_dirs( path_1, path_2, function(err){
			t.ok(!err, 'two identical directories');
			compare_dirs(path_1, path_3, function(err){
				t.ok(err, 'first not equal to second');
				compare_dirs(path_3, path_1, function(err){
					t.ok(err, 'second not equal to first');
					t.end();
				})
			})
		});
	}) // end tap.test 1
}

if (true) {
	tap.test('comparing directories with same files, different content', function (t) {
		var path_1 = path.resolve(root, 'compare_tests/t2/a');
		var path_2 = path.resolve(root, 'compare_tests/t2/b');
		var path_3 = path.resolve(root, 'compare_tests/t2/c');

		compare_dirs( path_1, path_2, function(err){
			t.ok(!err, 'two identical directories');
			compare_dirs(path_1, path_3, function(err){
				t.ok(err, 'first not equal to second');
				compare_dirs(path_3, path_1, function(err){
					t.ok(err, 'second not equal to first');
					t.end();
				})
			})
		});
	}) // end tap.test 2
}

if (true) {
	tap.test('comparing deeper directories with same files, different content', function (t) {
		var path_1 = path.resolve(root, 'compare_tests/t3/a');
		var path_2 = path.resolve(root, 'compare_tests/t3/b');
		var path_3 = path.resolve(root, 'compare_tests/t3/c');

		compare_dirs( path_1, path_2, function(err){
			t.ok(!err, 'two identical directories');
			compare_dirs(path_1, path_3, function(err){
				t.ok(err, 'first not equal to second');
				compare_dirs(path_3, path_1, function(err){
					t.ok(err, 'second not equal to first');
					t.end();
				})
			})
		});
	}) // end tap.test 2
}
	 