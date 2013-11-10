var currentZone,
	currentNumberZone,
	currentQuestion,
	currentNumberQuestion,
	socket;

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
		modalMessage("Dommage, ce n'est pas la bonne réponse" ,3);
	});
	$('#reponses').on('click','.bon',function(){
		socket.emit('bonnereponse', {joueur:joueur});
		afficheQuestion(currentNumberQuestion+1,true);
	});
});

/********************* Lib tools fourre tout :) (oui c'est pourri mais on s'en fout !!!!!) ***********/

var restart = function restart(){
	modalMessage("Fin de partie",3);	
	$('#start').show();
}

var startGame = function startgame(){
	$('#start').hide();
	modalMessage("Prêt ?" ,3);
	changeZone(1);
}

var afficheQuestion = function afficheQuestion(number,bon){
	currentQuestion = currentZone.questions[number];
	currentNumberQuestion = number;

	if(currentNumberQuestion >= 4){
		victoire();
	}else{
		if(bon == true){
			modalMessage('Bonne réponse',3);
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
	modalMessage("Bravo, joueur "+joueur+", vous remportez cette manche !",5,reponseZone);
}

var finDeManche = function finDeManche(numJoueur){

	modalMessage("Dommage, Le joueur "+numJoueur+" remporte cette manche !",5,reponseZone);
}

var felicitationFinal = function felicitationFinal () {
	modalMessage("Bravo, joueur "+joueur+", vous remportez cette dernière manche !",5,reponseZone);
	setTimeout(restart, 5000);	
}

var finDuJeu = function finDuJeu(numJoueur){
	modalMessage("Dommage, Le joueur "+numJoueur+" remporte cette dernière manche !",5,reponseZone);	
	setTimeout(restart, 5000);	
}

//afficher le texte de fin de zone
var reponseZone = function reponseZone(){
	var resultat = '<p>'+currentZone.resultatok.texte+'</p>';
	if(currentZone.resultatok.image && currentZone.resultatok.image != ''){
		resultat += '<img src="img/'+currentZone.resultatok.image+'>';
	}
	modalMessage(resultat,20,nextZone);
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
	if(callback != undefined){
		setTimeout(callback, timer);
	}
	var msg = $('<div>'+msg+'</div>');
	$.colorbox({
		html:msg,
		overlayClose:false,
		closeButton:false,
		maxWidth:"800"
	});
	setTimeout(function(){$.colorbox.close()},timer*1000);
	//alert(msg+ '  => wait '+ timer+'s');
}