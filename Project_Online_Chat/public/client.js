/* Shorthand for $(document).ready(...),
 The function will be executed only when the document has finished loading.
 This function contains JQuery Code inside.
 JQuery works on client side and does not require page reloading*/

$(function() {

    var socket = io();                                      // It does auto-discovery (find socket), allows bidirectional
                                                            // communication between the client and a server.

    // Send info to the server:
    $('form').submit(function(){                            //  If form is submit, perform the action
        socket.emit('chat', $('#messaging-field').val());   // Transmit message: type: 'chat', content: field text
            $('#messaging-field').val('');                  // Update the field with the empty string
            return false;                                   // Finish submission
    });

    // Get info from the server
    socket.on('chat', function(msg){                        // When get info from the server, do the following
	    $('#messages-list').append($('<li>').text(msg));    // Find list of messages, add another one with msg text
    });
});
