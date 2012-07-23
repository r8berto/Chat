var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);
io.set('origin','*');

function handler (req, res) {
  fs.readFile('index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin' : '*'
	});
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('login', { hello: 'Hi client' });
  socket.on('loged', function (data) {
    console.log(data);
  });
  socket.on('message', function (data) {
    console.log(data);
    socket.broadcast.emit('msgBroadcast', data );
  });
});

