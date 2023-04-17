const path = require('path');

module.exports = function(app){
	app.get('/', function(req, res){
		var data = { 
			layout: path.join(_r_, 'app', 'views', 'layouts', 'default'),
			title: 'Vanilla ThreeJS Starter Watcher'
		};
		res.render( path.join(_r_, 'app', 'views','index'), data );
	});
}