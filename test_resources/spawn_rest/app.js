/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, mvc = require('hive-mvc')
	, util = require('util')
	, mongoose = require('mongoose')
	, path = require('path');

module.exports = function (port, cb) {

	var app, server;
	app = express();


	var db_name = 'mongoose_model_tests_' + Math.floor(Math.random() * 100000 + .001);
	var con = 'mongodb://localhost/' + db_name;
	console.log('creating %s', con);
	mongoose.connect(con);

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
		app.use(express.static(path.join(__dirname, 'public')));
	});

	app.configure('development', function () {
		app.use(express.errorHandler());
	});

	server = http.createServer(app);
	server.on('close', function () {
		console.log('======== closing server');
	});

	server.listen(app.get('port'), function () {
		var apiary = mvc.Apiary({mongoose: mongoose},  path.join(__dirname, 'frames'));
		console.log('initializing apiary');
		apiary.init(function () {
			app.use(apiary.Static.resolve);
			apiary.serve(app, server);
			if (cb) {
				cb(null, apiary);
			}
		});
	});

	return server;
}