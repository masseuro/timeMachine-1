var currentZone,
	currentNumberZone,
	currentQuestion,
	currentNumberQuestion,
	socket,
	timeDefault = 3,
	timeFin = 2,
	timeLecture = 15;

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

	//gestion début de partie
	$('#start').on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		socket.emit('start');
		startGame();
		
	});

	//gestion bonnes ou mauvaises réponses
	$('#reponses').on('click','.faux',function(){
		modalMessage("<p>Dommage, ce n'est pas la bonne réponse</p>" ,timeDefault);
	});
	$('#reponses').on('click','.bon',function(){
		socket.emit('bonnereponse', {joueur:joueur});
		afficheQuestion(currentNumberQuestion+1,true);
	});
});

/********************* Lib tools fourre tout :) (oui c'est pourri mais on s'en fout !!!!!) ***********/

var restart = function restart(){
	modalMessage("<p>Fin de partie</p>",timeDefault);	
	$('#start').show();
}

var startGame = function startgame(){
	$('#start').hide();
	modalMessage("<p>Prêt ?</p>" ,timeDefault);
	changeZone(1);
}

var afficheQuestion = function afficheQuestion(number,bon){
	currentQuestion = currentZone.questions[number];
	currentNumberQuestion = number;

	if(currentNumberQuestion >= 4){
		victoire();
	}else{
		if(bon == true){
			modalMessage('<p>Bonne réponse</p>',timeDefault);
		}
		var questionNumber = number +1 ;
		$('#questiontexteInner').html('<p><strong>Question '+ questionNumber +'/4 :</strong><br>' + currentQuestion.question.texte + '</p>');
		if(currentQuestion.question.image != ""){
			$('#questionimage').html("<div id='realQuestionImage' style='background-image:url(img/" + currentQuestion.question.image + ")'/>");
		}else{
			$('#questionimage').html('');
		}

		var reponses = '';
		for(var i = 0; i<currentQuestion.reponses.length; i++ ){
			reponses += '<li>';
			var numQuestion = i+1;
			if(currentQuestion.reponses[i].resultat){
				reponses += '<button class="bon"><strong>' + numQuestion + '</strong>' + currentQuestion.reponses[i].texte + '</button>';
			}else{
				reponses += '<button class="faux"><strong>' + numQuestion + '</strong>' + currentQuestion.reponses[i].texte + '</button>';
			}

			reponses += '</li>';		
		}
		$('#reponses').html(reponses);
	}
}

var changeZone = function changeZone(zoneNumber){
	currentZone = getZoneFromNumber(zoneNumber);
	afficheQuestion(0);
}

var nextZone = function nextZone(){
	changeZone(currentNumberZone+1);
}
	
var victoire = function victoire(){
	if(currentNumberZone >= 4){
		socket.emit('endvictoire', {joueur:joueur});
		felicitationFinal();
	}else{
		socket.emit('victoire', {joueur:joueur});
		felicitation();
	}
}

var felicitation = function felicitation(){
	var msg ="Bravo, joueur "+retourneJoueur(joueur)+", vous remportez cette manche !";
	reponseZone(msg);
}

var finDeManche = function finDeManche(numJoueur){

	var msg ="Dommage, Le joueur "+retourneJoueur(numJoueur)+" remporte cette manche !";
	reponseZone(msg);
}

var felicitationFinal = function felicitationFinal () {
	var msg = "Bravo, joueur "+retourneJoueur(joueur)+", vous remportez cette dernière manche !";
	
	reponseZone(msg);
	setTimeout(restart, timeLecture * 1000);	
}

var finDuJeu = function finDuJeu(numJoueur){
	var msg ="Dommage, Le joueur "+retourneJoueur(numJoueur)+" remporte cette dernière manche !";	
	reponseZone(msg);
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

var getZoneFromNumber = function getZoneFromNumber(zoneNumber){
	currentNumberZone = zoneNumber;
	for (i in zones.zones ){
		var zone = zones.zones[i];
		if(zone.zone == zoneNumber){

			return zone;
		}
	}
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