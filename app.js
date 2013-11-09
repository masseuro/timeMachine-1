var express = require('express'),
	app = express(),
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
app.get('/client1', function (req,res) {
	res.sendfile(__dirname + '/public/client.html');
});
app.get('/client2', function (req,res) {
	res.sendfile(__dirname + '/public/client.html');
});
app.get('/client3', function (req,res) {
	res.sendfile(__dirname + '/public/client.html');
});
app.get('/client4', function (req,res) {
	res.sendfile(__dirname + '/public/client.html');
});
app.get('/screen', function (req,res) {
	res.sendfile(__dirname + '/public/screen.html');
});

//Routes static
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/img", express.static(__dirname + '/public/img'));

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