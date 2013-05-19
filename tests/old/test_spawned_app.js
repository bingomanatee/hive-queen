var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var q = require('./../../lib/index');
var request = require('request');
var rmdir = require('rmdir');
var mkdirp = require('mkdirp');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

var root = path.resolve(__dirname, '../test_resources');
var app_path = 'spawn_app';
var app_root = path.resolve(root, app_path);
var frame_root = path.resolve(root, app_path, 'frames');

/* ************************* TESTS ****************************** */

var config = require(path.resolve(root, 'configs/test_spawned_app.json'));

tap.test('test rest spawners', function (t) {
	var server;

	function _finish() {
		rmdir(frame_root, function () {
			server.close();
			t.end();
		});
	}

	mkdirp(frame_root, function () {
		rmdir(frame_root, function () {
			mkdirp(frame_root, function () {
				q.spawn(frame_root, config, function () {

					require(path.join(app_root, '/app'))(3123, function (err, apiary, s) {
						server = s;
						setTimeout(function () {
							request.get('http://localhost:3123/member/login', function (err, res, body) {
								t.equal(body, config.frames.membership.hives.member_pages.actions.login.template_content);

								/**
								 * step one - get all members
								 */
								request.get('http://localhost:3123/membership/rest',
									function (err, res, body) {
										//	console.log('getting members: %s', body);
										try {
											var data = JSON.parse(body);
										} catch (err) {
											return _finish();
										}
										t.deepEqual(data, [
											{
												"id":          1,
												"member_name": "moe",
												"password":    "chowderhead"
											},
											{
												"id":          2,
												"member_name": "steve",
												"password":    "2wildandcrazyguys"
											}
										], 'testing JSON from getting all members')

										/**
										 * step two - insert a new person
										 */
										var req = request.post('http://localhost:3123/membership/rest',
											{
												form: {
													member_name: 'fred',
													password:    'flintstone'
												}
											}, function (err, res, body) {
												try {
													var data = JSON.parse(body);
												} catch (err) {
													t.fail(err, 'cannot parse ' + body);
													return _finish();
												}
												t.deepEqual(data, {
													"member_name": "fred",
													"password":    "flintstone",
													"id":          3
												}, 'testing JSON from put member');

												/**
												 * re-sampling all records to see that fred is present
												 */
												request.get('http://localhost:3123/membership/rest',
													function (err, res, body) {

														//	console.log('getting members: %s', body);
														try {
															var data = JSON.parse(body);
														} catch (err) {
															t.fail(err, 'cannot parse body ' + body);
															return _finish();
														}
														t.deepEqual(data, [
															{
																"id":          1,
																"member_name": "moe",
																"password":    "chowderhead"
															},
															{
																"id":          2,
																"member_name": "steve",
																"password":    "2wildandcrazyguys"
															},
															{
																"id":          3,
																"member_name": "fred",
																"password":    "flintstone"
															}
														], 'fred added to all members');

														/**
														 * now let's delte fred
														 */
														request({uri: 'http://localhost:3123/membership/rest/3', method: 'DELETE'}, function (err, res, body) {
															console.log('fred deleted: %s', body);
															var data;
															try {
																data = JSON.parse(body);
															} catch (err) {
																t.fail(err);
																return _finish();
															}

															t.deepEqual(
																data,
																{
																	"id":          3,
																	"member_name": "fred",
																	"password":    "flintstone"
																}, 'deletion returns freds record');

															request.get('http://localhost:3123/membership/rest',
																function (err, res, body) {
																	//	console.log('getting members: %s', body);
																	try {
																		var data = JSON.parse(body);
																	} catch (err) {
																		return _finish();
																	}
																	t.deepEqual(data, [
																		{
																			"id":          1,
																			"member_name": "moe",
																			"password":    "chowderhead"
																		},
																		{
																			"id":          2,
																			"member_name": "steve",
																			"password":    "2wildandcrazyguys"
																		}
																	], 'testing JSON after fred deleted')
																	_finish();
																});
														});

													});
											});

									}) // end request.get

								//rmdir(frame_root, _.bind(t.end, t));
							})
						}, 1000);
					});
				}, 'created rest actions');
			})
		})
	})
});


