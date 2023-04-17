'use strict';
global._r_ 			= __dirname;
const express 		= require('express');
const exphbs 		= require('express-handlebars');
const Handlebars 	= require('handlebars');
const path 			= require('path');
const reload 		= require('reload');
const port 			= require( path.join( _r_, 'app', 'port.js' ) );
const ext 			= ".hbs";
const app 			= express();
const args 			= process.argv.slice(2);

const imjson = require("./import-map.json");
app.locals.importmap = JSON.stringify(imjson); // load as json into /views/layouts/default.hbs

const hbs = exphbs.create({
	defaultLayout	: path.join(_r_, 'app', 'views', 'layout', 'default'),
	extname			: ext,
	handlebars		: Handlebars
});

app.disable('x-powered-by')
	.engine(ext, hbs.engine)
	.set('view engine', ext);

app.use( express.static(_r_))
	.use( express.static( path.join(_r_,'static') ))
	.use( '/three/', express.static( path.join(_r_,'node_modules','three' )) )
	.use( '/build/', express.static( path.join(_r_,'node_modules','three', 'build' )) )
	.use( express.static( path.join(_r_,'node_modules','reload', 'lib') ) );

require( path.join( _r_, 'app', 'routes', 'route.js') )(app)

const server = require('http').createServer(app)

if (args.includes("--bundle")) {// Development
	app.locals.reload = '<script src="/reload/reload.js"></script>'	
	reload(app).then(function (reloadReturned) {
		server.listen(port.address)
	}).catch(function (err) {
		console.error('Reload could not start!', err)
	});
} else {// Production
	server.listen(port.address, function () {
		console.log( port.host +' Production listening on: '+ port.address );
	});
}
