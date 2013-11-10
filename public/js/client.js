var currentZone;
var currentNumberZone;
var currentQuestion;
var currentNumberQuestion;

$(function(){
	var socket = io.connect(window.location.origin);
	socket.on('changeZone', function (data) {

		changeZone(data.zoneNumber);
	});


	//gestion bouton

	//gestion début de partie
	$('#start').on("click", function() {
		socket.emit('start', changeZone(1));
		$('#start').hide();
		console.log("start");
	});

	//gestion bonnes ou mauvaises réponses
	$('#reponses').on('click','.faux',function(){
		alert('perdu');
	});
	$('#reponses').on('click','.bon',function(){
		alert('Question suivante');
		
		afficheQuestion(currentNumberQuestion+1);
		
	});
});

/********************* Lib tools fourre tout :) (oui c'est pourri mais on s'en fout !!!!!) ***********/

var afficheQuestion = function afficheQuestion(number){
	currentQuestion = currentZone.questions[number];
	currentNumberQuestion = number;
	if(currentQuestion == undefined){
		alert("Gagné !");
		changeZone(currentNumberZone+1);
	}else{
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
	

var getZoneFromNumber = function getZoneFromNumber(zoneNumber){
	currentNumberZone = zoneNumber;
	for (i in zones.zones ){
		var zone = zones.zones[i];
		if(zone.zone == zoneNumber){

			return zone;
		}
	}
}