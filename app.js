//variables
var connections = [];
var roomNum = 1;
var roomSize = 8

var express = require("express");
var app = express();

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3300;

//start listening
server.listen(port, function(){
    log("Welcome Live Run socket.io server, server is running port " + port);
});

var log = function (obj) {
    console.log(JSON.stringify(obj));
};

io.sockets.on('connection', function (socket) {
    connections.push(socket.id);

    log('Connection started ' + socket.id + ', # of connections ' + connections.length);


    socket.on('disconnect', function (data) {

        log('Connection lost ' + socket.id + ', # of connections ' + connections.length);

    });

    //broadcast message
    socket.on('SEND_MESSAGE', function (data) {
        io.sockets.emit('SEND_MESSAGE', { msg: data });
    });

    //let create room 
    socket.on('UPDATE_RUN', function (data) {
        io.sockets.emit('UPDATE_RUN', data);
    });

     //let create room 
    socket.on('START_RUN', function (data) {
        io.sockets.emit('START_RUN', data);
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });
    
   //let create room 
    socket.on('JOIN_ROOM', function (data) {
        io.sockets.emit('JOIN_ROOM', data);
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });
});
