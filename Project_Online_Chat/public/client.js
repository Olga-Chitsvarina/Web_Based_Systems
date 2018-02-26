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


    /*==============================================================================================================*/
    /* LISTEN TO INFO FROM THE SERVER */
    function returnTime(msgObj){
        var hours = msgObj.hours;
        var minutes = msgObj.minutes;
        var seconds = msgObj.seconds;

        var hoursString = ((hours<10) ? ("0" + hours) : (hours+ ""));
        var minutesString = ((minutes <10) ? ("0" + minutes) : (minutes+""));
        var secondsString = ((seconds <10)? ("0" + seconds) : (seconds+""));

        return hoursString + ":" + minutesString + ":" + secondsString;
    }

    function formatMessage(msgObj){

        var timeStamp = returnTime(msgObj);
        var name = msgObj.name;
        return timeStamp + " " + name + ": " + msgObj.msg;

    }


    // Get info from the server
    socket.on('chat', function(msgObjStringified){                // When get info from the server, do the following
        var msgObj = JSON.parse(msgObjStringified);
	    $('#messages-list').append($('<li>').text(formatMessage(msgObj)));    // Find list of messages, add another one with msg text
    });

    socket.on('change-name', function(name){
        $('#name-field-header').text( "Your nickname is: " + name);
    });
});
