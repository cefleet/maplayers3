//loads express
//global.config = require('./config');
var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , pg = require('pg');

app.use(express.bodyParser());

//Enables loads static files like css, and js
app.use('/', express.static('public'));

server.listen('1999');
io.sockets.on('connection', function (socket) {

    //wait's till the client is ready then gets the config 
    //then emits it via ready
    socket.on('getConfig', function(data){
        
        app.use("/configs/", 
            express.static(__dirname + "/configs/"+data.mapId));
            
        socket.emit('ready', {status:'ready'});
        //data should have the map id
        //var mapConfig = require('./configs/'+data.mapId+'.js');
        //socket.emit('ready', mapConfig);
    });
});