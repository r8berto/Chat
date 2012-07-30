var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(2335);
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
  socket.on('join room', function(data) {
    socket.join(data.room);
    socket.joinedRoom = data.room;
    socket.user = data.user;
    socket.emit('joined', socket.user + ' in ' + socket.joinedRoom);
    socket.broadcast.to(socket.joinedRoom)
                       .send(socket.user + ' joined room');
  });
  socket.on('msg', function (data) {
      if (socket.joinedRoom) {
        socket.broadcast.to(socket.joinedRoom).emit('messageBroadcast', {user: socket.user, msg: data.msg} );
      } else {
        socket.send(
           "you're not conected"
        );
      }
  });
});
