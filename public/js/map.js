var currentZone,
	 currentNumberZone = 0,
	 currentQuestion,
	 currentNumberQuestion,
	 socket,
	 resetTimeOut,
	 resetTime = 5*60,
	 timeLecture = 15;

$(function(){
	socket = io.connect(window.location.origin);
	socket.on('changeZone', function (data) {
		//on passe à la zone suivante
		changeZone(data.zoneNumber);
	});

	socket.on('restart', function(data){
		restart();
		alive();
	});
	socket.on('startGame', function(data){
		startGame();
	});

	socket.on('finDeManche', function (data) {
		finDeManche(data.joueur);
		alive();
	});

	socket.on('finDuJeu', function (data) {
		finDuJeu(data.joueur);
		alive();
	});

	socket.on('alive', function (data) {
		alive();
	});
});


/********************* Lib tools fourre tout :) (oui c'est pourri mais on s'en fout !!!!!) ***********/

var alive = function alive(){
	clearTimeout(resetTimeOut);
	resetTimeOut = setTimeout(restart, resetTime*1000);
}

var restart = function restart(){
	socket.emit('reset');	
	modalMessage("Fin de partie",3);
	$('#start').show();
	$('#zone1').hide();
	$('#zone2').hide();
	$('#zone3').hide();
	$('#zone4').hide();
}

var startGame = function startgame(){
	$('#start').hide();
    changeZone(1);
	resetTimeOut = setTimeout(restart, resetTime*1000);
}

var changeZone = function changeZone(zoneNumber){
	currentZone = getZoneFromNumber(zoneNumber);
//	var num = zoneNumber-1;
	$('#zone'+zoneNumber).show();
}

var nextZone = function nextZone(){
	changeZone(currentNumberZone+1);
}

var finDeManche = function finDeManche(numJoueur){
	var msg ="Bravo, Le joueur "+retourneJoueur(numJoueur)+" remporte cette manche !";
	reponseZone(msg);
}

var finDuJeu = function finDuJeu(numJoueur){
	$('#zone4').show();
	var msg ="Bravo, Le joueur "+retourneJoueur(numJoueur)+" remporte cette dernière manche !<br><br>Le jeu se termine ici, merci d'avoir participé, et bonne visite";
	modalMessage(msg,timeLecture,restart);
	setTimeout(restart, timeLecture * 1000);	
}

//afficher le texte de fin de zone
var reponseZone = function reponseZone(msg){
	
	var resultat = '<p>'+msg+'</p><p>'+currentZone.resultatok.texte+'</p>';
	if(currentZone.resultatok.image && currentZone.resultatok.image != ''){
		resultat += '<img src="img/'+currentZone.resultatok.image+'>';
	}
	modalMessage(resultat,timeLecture,nextZone);
}

//Timer à afficher, modal qui s'affiche pendant le temps, callback à appeler à la fin du timer
var modalMessage = function modalMessage(msg, timer, callback){
	$.colorbox({
		html:msg,
		overlayClose:false,
		closeButton:false,
		maxWidth:"800"
	});
	setTimeout(function(){$.colorbox.close()},timer*1000);

	if(callback != undefined){
		setTimeout(function(){callback()}, timer*1000);
	}
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


var retourneJoueur = function retourneJoueur(numJoueur){
	var resultat;
	switch(numJoueur){
		case 1:
			resultat = "'tour'";
			break;
		case 2:
			resultat = "'éléphant'";
			break;
		case 3:
			resultat = "'petit LU'";
			break;
		case 4:
			resultat = "'bâteau'";
			break;
	}
	return resultat;
}