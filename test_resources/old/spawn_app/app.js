/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, mvc = require('hive-mvc')
	, util = require('util')
	, path = require('path');

module.exports = function (port, cb) {

	var app, server;
	app = express();

	app.configure(function () {
		app.set('port', port || 3000);
		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		app.use(express.favicon());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
	});

	app.configure('development', function () {
		app.use(express.errorHandler());
	});

	server = http.createServer(app);
	server.on('close', function () {
		console.log('======== closing server');
	});

	server.listen(app.get('port'), function () {
		var apiary = mvc.Apiary({},  path.join(__dirname, 'frames'));
		console.log('initializing apiary');
		apiary.init(function () {
			app.use(apiary.Static.resolve);
			apiary.serve(app, server);
			if (cb) {
				cb(null, apiary, server);
			}
		});
	});

	return server;
}