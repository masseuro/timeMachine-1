
	var socket = io.connect(window.location.origin);
	  socket.on('truc', function (data) {
	    console.log(data);
	  });

	  var btn = document.getElementById('btn');
	  var inputIn = document.getElementById('in');

	  btn.onclick = function() {
	  	socket.emit('click', { led: inputIn.value });
	  };
