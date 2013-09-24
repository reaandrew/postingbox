
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req,res){
    res.render('index', { title: 'Express' });
});
app.post('/', function(req,res){
    console.log("emitting ", req.query.ref," with data ", req.body);
    io.sockets.emit(req.query.ref, JSON.stringify(req.body));
    res.send(200);
});

io.sockets.on('connection', function (socket) {
    
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
     console.log(data);
    });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
