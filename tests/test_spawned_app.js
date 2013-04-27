var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var q = require('./../lib/index');
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

if (true) {
	var config = {
		frames: {
			membership: {
				hives: {
					members: {
						actions: [
							{
								name:       'member_rest',
								rest:       true,
								model_name: 'Members'
							},
							{
								name:       'acl',
								rest:       true,
								model_type: 'mongoose',
								model_name: 'Members_ACL'
							},

							{
								name:       'messages',
								rest:       true,
								model_type: 'hive_model',
								model_name: 'Messages'
							}
						]
					},

					member_pages: {
						config:  {
							root_route: '/member'
						},
						actions: {

							login: {
								config:           {
									routes: {
										'get': '*/login'
									}
								},
								template_content: '<form method="/member/login"><h1>Log In</h1>' +
									                  '<p>Username <input type="text" name="userame" /></p>' +
									                  '<p>Password <input type="password" name=password" /></p>' +
									'</form>'
							}
						}
					}
				}
			}
		}

	};

	tap.test('test rest spawners', function (t) {
		mkdirp(frame_root, function () {
			console.log('ensured directory %s', frame_root);
			rmdir(frame_root, function () {
				console.log('... wiped dir');
				mkdirp(frame_root, function () {
					console.log('spawning...');
					q.spawn(frame_root, config, function () {

						require(path.join(app_root, '/app'))(3123, function (err, apiary, server) {
							setTimeout(function () {
								request.get('http://localhost:3123/member/login', function (err, res, body) {
									t.equal(body, config.frames.membership.hives.member_pages.actions.login.template_content);
									server.close();
									t.end();
								})
								//rmdir(frame_root, _.bind(t.end, t));
							}, 1000);
						});
					}, 'created rest actions');
				})
			})
		})
	})
}

