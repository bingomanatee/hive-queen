/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, mvc = require('./../../index')
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
		// app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		// app.use(require('less-middleware')({ src: __dirname + '/public' }));
		app.use(express.static(path.join(__dirname, 'public')));
	});

	app.configure('development', function () {
		app.use(express.errorHandler());
	});

	app.get('/', routes.index);
	app.get('/users', user.list);

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