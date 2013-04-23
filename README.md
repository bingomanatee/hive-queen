hive-queen
==========

A directory spawner for hive-mvc websites.

hive-queen is nondestructive - that is it does not edit or overwrite any files or directories that have been created,
and it does not delete directories if they are not included in the configuration file.

Hive has a fairly deep taxonomy:

FRAMES contain HIVES contain ACTIONS contain STATIC FOLDERS

and (the first three) can contain RESOURCE FOLDERS including MODELS,MIXINS,VIEW_HELPERS and RESORUCES.

Because as a rule each type of thing is contained in a "type folder" your folder heirarchy can get quite deep.
Here are a few sample directory chains

frames/blog/hives/articles/actions/new
frames/blog/hives/articles/actions/new/static/js

frames/blog/hives/articles/actions/add
frames/blog/hives/articles/actions/add/static/js

frames/blog/hives/articles/actions/edit
frames/blog/hives/articles/actions/view

frames/blog/hives/admin/actions/approve
frames/blog/hives/admin/actions/new_chapter
frames/blog/hives/admin/actions/new_chapter/static/js

And of course, these directories contain scripts, client side resource, config files et all.

hive-queen is an attempt to kickstart a site by establishing a standard scaffold that should work out of the box.
For the action script JavaScript file, this is especially useful as the chain of files for multi method actions
is a bit deep.

Creating a site with hive-queen
-------------------------------

Once you have an understanding of how things nest, creatinga  site with hive-queen is simple.

      var q = require('hive-queen');
      q.spawn({
      	frames: {
      		blog: {
      			hives: {
      				articles: {
      				 	actions: [
							'new',
							'add',
							'edit',
							'view' ]
      					},
      				admin: {
      					actions: [
      						'approve',
      						'new_chapter'
      						]
      					}
      			}
      		}
      	}
      }, function(){
      	console.log('done spqwning site');
      })

Note how this heirarchy follows the pattern

{type_name: {instance: {}, instance: {}, instance: {} } }

recursively.

Again, as mentioned above, you can run this command any number of times as you develop your site to spawn
new branches.

Reducing Static boilerplate
---------------------------

By default queen will create a static directory for js, img, and css files for each action. This is overkill for
a REST endpoint (and many other situations). To tell queen NOT to add static directories,
or to customize how those static directories are created/described, be more specific in the action definition

      var q = require('hive-queen');
      q.spawn({
      	frames: {
      		blog: {
      			hives: {
      				articles: {
      					actions:[
      					{name: 'new', static: false},
      					{name: 'add', static: {'/js': '/js/art/add', '/forms': '*/forms', '/img': '/img/art/add'} },
      					'edit',
      					'view' ]
      					 },
      				admin:  {
      					actions: [
							'approve',
							'new_chapter'
							]
						}
      			}
      		}
      	}
      }, function(){
      	console.log('done spawning site');
      })

The name in the static hash is the actual subdir (within the static folder) in which your resources live.
The value is the URL prefix for those static files.

Also, if you have static property set to false, no static directories are created.

NOTE: hive-queen may make a site scaffold, but you must have hive-mvc in your node_modules to actually run the site
as well as an app.js file.