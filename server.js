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
    joinedRoom = data.room;
    user = data.user;
    socket.emit('joined', user + ', welcome to ' + joinedRoom);
    socket.broadcast.to(joinedRoom)
                       .send(user + ' joined room');
  });
  socket.on('msg', function (data) {
      if (joinedRoom) {
        socket.broadcast.to(joinedRoom).emit('messageBroadcast', {user: user, msg: data.msg} );
      } else {
        socket.send(
           "you're not joined a room." +
           "select a room and then push join."
        );
      }
  });
});
