var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	five = require('johnny-five'),
	board = new five.Board(),
	PORT = process.env.PORT || 9999,
	led;

server.listen(PORT);

board.on('ready', function() {
	console.log('board ok');
	led = new five.Led(13);
});


// routes
app.get('/clientTouch', function (req,res) {
	res.sendfile(__dirname + '/public/clientTouch.html');
});
app.get('/screen', function (req,res) {
	res.sendfile(__dirname + '/public/screen.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('truc', { hello: 'world' });
  
  socket.on('click', function (data) {
    console.log(data);

    if (data.led === 'on') {
    	led.on();
    }
    else {
    	led.off();
    }
  });
});