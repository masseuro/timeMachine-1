var currentZone,
	 currentNumberZone = 0,
	 currentQuestion,
	 currentNumberQuestion,
	 socket,
	 resetTimeOut;

$(function(){
	socket = io.connect(window.location.origin);
	socket.on('changeZone', function (data) {
		//on passe à la zone suivante
		changeZone(data.zoneNumber);
	});

	socket.on('restart', function(data){
		restart();
	});
	socket.on('startGame', function(data){
		startGame();
	});

	socket.on('finDeManche', function (data) {
		finDeManche(data.joueur);
	});

	socket.on('finDuJeu', function (data) {
		finDuJeu(data.joueur);
	});

	socket.on('alive', function (data) {
		clearTimeout(resetTimeOut);
		resetTimeOut = setTimeout(restart, 5000);
	});
});

/********************* Lib tools fourre tout :) (oui c'est pourri mais on s'en fout !!!!!) ***********/

var restart = function restart(){
	modalMessage("Fin de partie",3);	
	$('#start').show();
}

var startGame = function startgame(){
	$('#start').hide();
	changeZone(1);
	resetTimeOut = setTimeout(restart, 30000);
}

var changeZone = function changeZone(zoneNumber){
	currentZone = getZoneFromNumber(zoneNumber);
}

var nextZone = function nextZone(){
	changeZone(currentNumberZone+1);
}

var finDeManche = function finDeManche(numJoueur){
	modalMessage("Dommage, Le joueur "+numJoueur+" remporte cette manche !",5,reponseZone);
}

var finDuJeu = function finDuJeu(numJoueur){
	modalMessage("Dommage, Le joueur "+numJoueur+" remporte cette dernière manche !",5,reponseZone);	
	setTimeout(restart, 5000);	
}

//Timer à afficher, modal qui s'affiche pendant le temps, callback à appeler à la fin du timer
var modalMessage = function modalMessage(msg, timer, callback){
	if(callback != undefined){
		setTimeout(callback, timer);
	}
	alert(msg+ '  => wait '+ timer+'s');
}

var getZoneFromNumber = function getZoneFromNumber(zoneNumber){
	currentNumberZone = zoneNumber;
	for (i in zones.zones ){
		var zone = zones.zones[i];
		if(zone.zone == zoneNumber){

			return zone;
		}
	}
}