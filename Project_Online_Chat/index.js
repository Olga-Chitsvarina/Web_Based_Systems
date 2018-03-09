//======================================================================================================================
// SERVER SET UP:

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 30000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

//======================================================================================================================
// IMPORTANT GLOBAL VARIABLES:
var randomNamesArray = [ "Alligator", "Antelope", "Bear", "Beaver", "Cat", "Chicken", "Donkey", "Duck", "Eagle", "Elephant",
    "Fox", "Frog", "Grizzly", "Giraffe", "Hawk", "Hippopotamus", "Iguana", "Ibis", "Jellyfish", "Jaguar",
    "Kangaroo", "Koala", "Lobster", "Lion", "Leopard", "Lynx", "Moose", "Mouse", "Needlefish", "Nautilus",
    "Octopus", "Owl", "Pelican", "Penguin", "Quokka", "Raccoon", "Rabbit", "Shark", "Seastar", "Tiger",
    "Turtle", "Whale", "Yak", "Zebra"];
var randomAdjectivesArray = ["Ambitious","Brave", "Cute", "Clever", "Curious", "Confident", "Enthusiastic",
    "Experienced", "Friendly", "Generous", "Independent", "Kind", "Lovely", "Motivated", "Outgoing", "Passionate",
"Peaceful", "Polite", "Popular", "Positive", "Respectful", "Sweet"];

var onlineUserNamesArray = [];
var allUserObjectsArray = [];
var arrayOfMsgObj = [];

/*=====================================================================================================================
MESSAGE TYPES AND THEIR HANDLERS:*/

function changeNameIfCan(msg, msgObj, userObj){
    var newName = msg.substring(6);
    var currentName = userObj.nickName;

    if (currentName === newName){
        msgObj.type = 'display-error';
        msgObj.msg = ("Your nickname is already " + currentName) ;
        return msgObj;
    }

    if (isUnique(newName)){

        var oldName = userObj.nickName;
        onlineUserNamesArray = onlineUserNamesArray.filter(function (name) {return name !== oldName;});
        userObj.nickName = newName;

        msgObj.nickName = userObj.nickName = newName;
        msgObj.type = "change-nickName";
        return msgObj;
    }

    msgObj.type = 'display-error';
    msgObj.msg = ("We already have a user with this nickname, please select another one!");
    return msgObj;
}


function isValidColor(color) {
    return color.match(/^#[a-f0-9]{6}/i) !== null;
}

function changeColorIfCan(msg, msgObj, userObj){
    var newColor ="#"+ msg.substring(11);

    if (isValidColor(newColor)){
        msgObj.color = newColor;
        userObj.color = newColor;
        msgObj.type = 'change-color';
        return msgObj;
    }
    return msgObj;
}

function MessageObject(msg){
    this.msg = msg;

    var date = new Date();
    this.hours = date.getHours();
    this.minutes = date.getMinutes();
    this.seconds = date.getSeconds();

    this.nickName = "";
    this.color = "";
    this.type = "";
}

function returnMessageObject(msg, userObj){

    var slice1 = msg.substring(0,6);
    var slice2 = msg.substring(0, 11);
    var msgObj = new MessageObject(msg);

    if (slice1 === "/nick "){
        return changeNameIfCan(msg, msgObj, userObj);
    }

    msgObj.color = userObj.color;
    msgObj.type = "chat";
    msgObj.nickName = userObj.nickName;

    if (slice2 === "/nickcolor "){
        return changeColorIfCan(msg, msgObj, userObj);
    }

    return msgObj;
}
//======================================================================================================================
// NEW CONNECTION:
function isUnique(nickName){
    var i = 0;
    while(i< allUserObjectsArray.length){
        if (allUserObjectsArray[i].nickName === nickName){
            return false;
        }
        i++;
    }
    return true;
}

function UserObject(socket){
    this.nickName = returnRandomName();
    this.color = "#000";
    //this.ids = [socket.id];

    this.socketsArray = [socket];


    // Return random nickName from the list of names
    function returnRandomName(){
        var uniqueBool = false;
        while(!uniqueBool){
            var nick = randomAdjectivesArray[Math.floor(Math.random()*randomAdjectivesArray.length)];
            var name = randomNamesArray[Math.floor(Math.random()*randomNamesArray.length)];
            var nickName = nick +"_" + name;
            uniqueBool =isUnique(nickName);
        }
        return nickName;
    }
}

//======================================================================================================================
// GET USER:

function returnUserUsingName(nickNameStr){
    var i = 0;
    while(i< allUserObjectsArray.length){
        if (allUserObjectsArray[i].nickName === nickNameStr){
            return allUserObjectsArray[i];
        }
        i++;
    }
    return false;
}

function returnUserObjUsingSocket(socket){
    var i = 0;
    while(i< allUserObjectsArray.length){
        if (allUserObjectsArray[i].socketsArray.includes(socket)){
            return allUserObjectsArray[i];
        }
        i++;
    }
    return false;
}


//======================================================================================================================
// COOKIES RELATED:

function newConnection(socket,cookieNickNameStr){
    var userObj;

    if (cookieNickNameStr == null){
        userObj =  new UserObject(socket);
        allUserObjectsArray.push(userObj);
        setNewCookies(socket, userObj.nickName);
    }
    else{
        userObj = returnUserUsingName(cookieNickNameStr);
        userObj.socketsArray.push(socket);
        //userObj.ids.push(socket.id);
    }
    var nickNameStr = userObj.nickName;
    changeName(socket, nickNameStr);
    loadAllMessagesToOneBrowser(socket);
}
//======================================================================================================================
// UPDATES TO USER NAMES AND ACTIVE USERS LISTS:

function addActiveUser(userNameStr){
    if(!onlineUserNamesArray.includes(userNameStr)) {
        onlineUserNamesArray.push(userNameStr);
    }
    updateOnlineUsersListInTheBrowser();
}

function removeActiveUser(socket){
    var userObj =returnUserObjUsingSocket(socket);
    var nickName =userObj.nickName;
    userObj.socketsArray = userObj.socketsArray.filter(function (elm) {return elm !== socket;});
    if (userObj.socketsArray.length === 0) {
        onlineUserNamesArray = onlineUserNamesArray.filter(function (name) {return name !== nickName;});
        updateOnlineUsersListInTheBrowser();
    }
}


//======================================================================================================================
// SERVER TALKS TO A CLIENT:

function requestCookies(socket){
    socket.emit('send-cookies');
}

function setNewCookies(socket, newNickNameStr){
    socket.emit('set-cookies', newNickNameStr);
}

function updateOnlineUsersListInTheBrowser(){
    io.emit('update-online-users',JSON.stringify(onlineUserNamesArray));
}

function changeName(socket, newName) {
    socket.emit('change-nickName', newName);
    addActiveUser(newName);
}

function displayError(socket, msgError){
    socket.emit('display-error', msgError);
}

function loadAllMessagesToOneBrowser(socket){
    socket.emit('load-messages', JSON.stringify(arrayOfMsgObj));
}


//======================================================================================================================
//SERVER LISTENS TO A CLIENT:*/

io.on('connection', function(socket){

    requestCookies(socket);

    socket.on('receive-cookies', function(cookieNickNameStr){
        newConnection(socket, cookieNickNameStr);
    });

    socket.on('chat', function(msg){
        var userObj = returnUserObjUsingSocket(socket);
        var msgObj = returnMessageObject(msg, userObj);
        var type = msgObj.type;

        if (type === "change-nickName"){
            var i = 0;
            while(i< userObj.socketsArray.length){
                changeName(userObj.socketsArray[i], msgObj.nickName);
                i++;
            }

        }

        if (type === 'display-error'){
           displayError(socket, msgObj.msg);
        }

        if(type === "chat"){
            arrayOfMsgObj.push(msgObj);
            io.emit('chat',JSON.stringify(msgObj));
        }
    });
    socket.on('disconnect', function(){
        removeActiveUser(socket);
    });
});


