var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	five = require('johnny-five'),
	//board = new five.Board(),
	PORT = process.env.PORT || 9999,
	questions = require('questions.json'),
	jade = require('jade'),
	led;

//middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.cookieParser());


//lunch server
server.listen(PORT);

// board.on('ready', function() {
// 	console.log('board ok');
// 	led = new five.Led(13);
// });

// routes
app.get('/client1', function (req,res) {
	res.render('client.jade',{
		joueur:1,
		zones: JSON.stringify(questions)
	});
});
app.get('/client2', function (req,res) {
	res.render('client.jade',{
		joueur:2,
		zones: JSON.stringify(questions)
	});
});
app.get('/client3', function (req,res) {
	res.render('client.jade',{
		joueur:3,
		zones: JSON.stringify(questions)
	});
});
app.get('/client4', function (req,res) {
	res.render('client.jade',{
		joueur:4,
		zones: JSON.stringify(questions)
	});
});
app.get('/carte', function (req,res) {
	res.render('map.jade',{
		zones: JSON.stringify(questions)
	});
});

//Routes static
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/img", express.static(__dirname + '/public/img'));

io.sockets.on('connection', function (socket) {
  
  //lancement du jeu par un joueur on lance la premiere zone
  socket.on('start', function (data) {
    socket.broadcast.emit('startGame',{zoneNumber:1});
    socket.broadcast.emit('alive');
  });

  //Victoire de la manche par un joueur
  socket.on('victoire', function (data) {
    socket.broadcast.emit('finDeManche',{joueur:data.joueur});
    
  });

  socket.on('endvictoire', function (data) {
    socket.broadcast.emit('finDuJeu',{joueur:data.joueur});
    
  });

  //Bonne reponse d'un joueur
  socket.on('bonnereponse', function (data) {
    //TODO affichage led suivant data.joueur
    socket.broadcast.emit('alive');
  });

  socket.on('reset', function (data) {
    //TODO affichage led suivant data.joueur
    socket.broadcast.emit('restart');
  });
});