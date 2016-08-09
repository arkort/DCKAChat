﻿var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/dist/index.html');
});

io.on('connection', function (socket) {
    console.log('a user ' + socket.id +' connected');

    socket.on('chat message', function (msg) {
        socket.broadcast.emit('chat message', { message: msg, sender: socket.id });
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT, function () {
    console.log('listening on '+ process.env.PORT);
});