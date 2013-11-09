var currentZone;
var currentNumberZone;
var currentQuestion;
var currentNumberQuestion;

$(function(){
	var socket = io.connect(window.location.origin);
	socket.on('changeZone', function (data) {
		console.log('change');
		changeZone(data.zoneNumber);
	});


	//gestion bouton

	//gestion début de partie
	$('#start').on("click", function() {
		socket.emit('start', changeZone(1));
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
	console.log(number);
	currentQuestion = currentZone.questions[number];
	currentNumberQuestion = number;
	if(currentQuestion == undefined){
		alert("Gagné !");
		changeZone(currentNumberZone+1);
	}else{
		$('#questiontexte').html('<p>' + currentQuestion.question.texte + '</p>');
		if(currentQuestion.question.image != ""){
			$('#questionimage').html("<img src='" + currentQuestion.question.image + "'/>");
		}else{
			$('#questionimage').html('');
		}

		var reponses = '';
		for(var i = 0; i<currentQuestion.reponses.length; i++ ){
			reponses += '<li>';
			if(currentQuestion.reponses[i].resultat){
				reponses += '<button class="bon">' + currentQuestion.reponses[i].texte + '</button>';
			}else{
				reponses += '<button class="faux">' + currentQuestion.reponses[i].texte + '</button>';
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