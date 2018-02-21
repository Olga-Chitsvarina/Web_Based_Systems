// shorthand for $(document).ready(...)
$(function() {
    var socket = io();

    $('form').submit(function(){
	socket.emit('chat', $('#messaging-field').val());
	$('#messaging-field').val('');
	return false;
    });

    socket.on('chat', function(msg){
	$('#messages').append($('<li>').text(msg));
    });
});
