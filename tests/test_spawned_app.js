var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

/* ************************* TESTS ****************************** */

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