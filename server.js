var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/dist/index.html');
});

io.on('connection', function (socket) {
    var nick = socket.id;

    console.log('user ' + nick + ' connected');

    io.emit('chat message', { message: nick + ' has joined', isControl: true, for: 'everyone' });

    socket.on('chat message', function (msg) {
        process(msg);
    });

    socket.on('disconnect', function () {
        console.log('user ' + nick + ' disconnected');
        io.emit('chat message', { message: 'user ' + nick + ' disconnected', isControl: true, for: 'everyone' });
    });

    function process(msg) {
        if (msg[0] == '/') {
            var words = msg.split(' ');

            switch (words[0]) {
                case '/?':
                    socket.emit('chat message', { message: '/nick - change your nick', isControl: true });
                    break;
                case '/nick':
                    var oldNick = nick;
                    nick = words[1];
                    io.emit('chat message',  { message: oldNick+' changed name to '+nick, sender: nick, isControl: true, for: 'everyone' });
                    break;
                default:
                    io.emit('chat message', { message: msg, sender: nick, isControl: false, for: 'everyone' });
                    break;
            }
        }
        else {
            io.emit('chat message', { message: msg, sender: nick, isControl: false, for: 'everyone' });
        }
    }
});

http.listen(port, function () {
    console.log('listening on ' + port);
});