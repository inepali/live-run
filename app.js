//variables
var connections = [];
var rooms = [];

var express = require("express");
var app = express();

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3300;

//start listening
server.listen(port, function(){
    log("Welcome Live Run socket.io server, server is running port " + port);
    log("Version 1.0.2");
});

app.use(express.static(__dirname + '/public'));

var log = function (obj) {
    console.log(JSON.stringify(obj));
};

io.sockets.on('connection', function (socket) {
    connections.push(socket.id);

    log('Connection started ' + socket.id + ', # of connections ' + connections.length);

    log('Updating rooms to newly connected user');
    io.sockets.emit('UPDATE_ONLY_ROOMS', rooms);
    //io.sockets.connected[socket.id].emit('UPDATE_ONLY_ROOMS', rooms);

    socket.on('disconnect', function (data) {
        //log(connections);
        for (var i = 0; i < connections.length; i++) {
            if (connections[i] == socket.id) {
                connections.splice(i, 1);
            }
        }

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

     //when runner create a room 
    socket.on('START_RUN', function (data) {
        io.sockets.emit('START_RUN', data);
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });
    
   //let when someone join room 
    socket.on('JOIN_ROOM', function (data) {
        io.sockets.emit('JOIN_ROOM', data);
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });


    //let when someone join room 
    socket.on('UPDATE_ROOMS', function () {
        //io.sockets.connected[socket.id].emit('UPDATE_ROOMS', rooms);
        io.sockets.emit('UPDATE_ROOMS', rooms);
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });

    //let when runner create room
    socket.on('CREATE_ROOM', function (room) {
        console.log(room);
        room.createDate = new Date();
        rooms.push(room);

        console.log(rooms.length);
        
        io.sockets.emit('UPDATE_ROOMS', rooms);
        
        //io.sockets.to(player.room).emit('UPDATE_GAME', { players: players, thisPlayer: player, choiceCard: null });
    });
});
