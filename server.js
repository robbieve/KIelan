var Path = require('path');
var Handlebars = require('handlebars');
var nano = require('nano')('http://localhost:5984');
var db = nano.use('blog');
var Hapi = require('hapi');
var fs = require('fs');


var server = new Hapi.Server();
server.connection({ port:3000 });

server.route({
	method: 'GET',
	path: '/app/{filename*}',
	handler: {
		directory: {
			path: 'build',
			listing: true
		}
	}
})

server.views({
	engines: {
		'html': {
			module: require('handlebars')
		}
	},
	path: Path.join(__dirname, 'build'),
});

var HomeViewServerSide = function(request, reply) {
	var bodyString;
	var maxPost = (request.params.pageNumber * 5);

	db.view('blog', 'home', function(error, body) {
		bodyString = JSON.stringify(body.rows);
		if(!error) {
			console.log(bodyString);
		}
		else {
			console.log(error)
		}
	    
		reply(bodyString).type('text/json');
	});

};

var HomeViewAPI = function(request, reply) {
	console.log('this is necessary');
}

var landing = function(request, reply) {
	reply.file('./build/templates/index.html');
}

var test = function(request, reply) {
	reply.view('editor/editorIndex');
}

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: landing
});

server.route({
	method: 'GET',
	path: '/posts.json',
	handler: HomeViewServerSide
});

server.route({
	method: 'GET',
	path: '/homeview',
	handler: HomeViewAPI
});


server.route({
	method: 'GET',
	path: '/recievePost',
	handler: test
});

server.start(function () {
	console.log('Server launched at:', server.info.uri)
});

