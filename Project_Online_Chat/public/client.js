/* Shorthand for $(document).ready(...),
 The function will be executed only when the document has finished loading.
 This function contains JQuery Code inside.
 JQuery works on client side and does not require page reloading*/
$(function() {

    //==================================================================================================================
    //GENERAL SET UP:                                                                                                   */

    // auto-discovery, allows bidirectional communication between client and a server
    var socket = io();


    //==================================================================================================================
    //SEND INFORMATION TO THE SERVER:                                                                                */
    // Send form to the server:
    $('form').submit(function () {                              //  If form is submit, perform the action
        socket.emit('chat', $('#messaging-field').val());       // Transmit message: type: 'chat', content: field text
        $('#messaging-field').val('');                          // Update the field with the empty string
        return false;                                           // Finish submission
    });

    function returnCookies() {
        /*Cookies.set('cookieNickNameStr', null );
        socket.emit('receive-cookies',Cookies.get('cookieNickNameStr'))*/
        console.log(Cookies.get());
        socket.emit('receive-cookies', Cookies.get('cookieNickNameStr'));
    }

    function setCookies(newName) {
        Cookies.set('cookieNickNameStr', newName ,{ path: '' });
    }






//===========================================================================
    // DO IN HTML:
    function addNewUser(activeUserNameStr){
        var userList = $('#online-users-list');
        userList.append($('<li>').text(activeUserNameStr));
        var userListElement = document.getElementById('online-users-list');
        userListElement.scrollTop = userListElement.scrollHeight;
    }

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
        var boldBool = false;
        if (msgObj.nickName=== Cookies.get('cookieNickNameStr')){
            boldBool = true;
        }
        var timeStamp = returnTime(msgObj);
        var nickName = msgObj.nickName;
        var nameColor = msgObj.color;

        if (boldBool){
            return ("<strong>"
                + timeStamp + " " +
                "<span style= color:"+  nameColor+ ">" + nickName + "</span>" +
                ": " + msgObj.msg +
                "</strong>");
        }
        return timeStamp + " " + "<span style= color:"+  nameColor+ ">" + nickName + "</span>" + ": " + msgObj.msg;
    }

    function displayNewMessage(msgObj){
        var msgList =  $('#messages-list');

        msgList.append($('<li>').html(formatMessage(msgObj)));             // Find list of messages, add another one with msg text
        var msgListElement = document.getElementById('messages-list');
        msgListElement.scrollTop = msgListElement.scrollHeight;
    }



    /*======================================================================================================================
    GET INFORMATION FROM THE SERVER:
        */

    // Get info from the server
    socket.on('chat', function(msgObjStringified){                // When get info from the server, do the following
        var msgObj = JSON.parse(msgObjStringified);
        displayNewMessage(msgObj);
    });

    socket.on('display-error', function(msgError){
        alert(msgError);
    });

    socket.on('load-messages', function (arrayOfMsgObjStringified) {
        var arrayOfMsgObj = JSON.parse(arrayOfMsgObjStringified);
        document.getElementById('messages-list').innerHTML = "";

        var i = 0;
        while (i < arrayOfMsgObj.length) {
            displayNewMessage(arrayOfMsgObj[i]);
            i++;
        }
    });
    // LISTEN TO INFORMATION FROM THE SERVER
    socket.on('send-cookies', function(){
        returnCookies();
    });

    socket.on('set-cookies', function(newName){
        Cookies.set("cookieNickNameStr",newName);
    });

    socket.on('change-nickName', function(newName){
        setCookies(newName);
        $('#name-field-header').text(newName);
    });

    socket.on('update-online-users', function(onlineUserNamesArray) {
        var arrayOfActiveUsers = JSON.parse(onlineUserNamesArray);
        document.getElementById('online-users-list').innerHTML = "";
        var i = 0;
        while (i < arrayOfActiveUsers.length) {
            addNewUser(arrayOfActiveUsers[i]);
            i++;
        }
    });
});

