var http = require('http');
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var url = require('url');

var PORT_NUMBER = 8000;

http.createServer(function (req, res) {
	var filePath = url.parse(req.url).pathname;
	//Normalize to avoid exploit: get /../server.js
	var normalizedPath = path.normalize(filePath);
	var fileName = path.join('content' + normalizedPath);

	fs.exists(fileName, function (exists) { //path.exists for Node 0.6 and below
		if (!exists) {
			res.statusCode = 500;
			return res.end('File not found.');
		}

		fs.readFile(fileName, function (err, data) {
			if (err) {
				return res.end('Server Error!');
			}

			res.setHeader("Content-Type", mime.lookup(path.extname(fileName)));
			return res.end(data);
		});
	});
}).listen(PORT_NUMBER, function () {
	console.log('Listening on %d', PORT_NUMBER);
});
