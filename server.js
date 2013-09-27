var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var querystring = require("querystring");

var clientHtml = fs.readFileSync(path.join(__dirname,"client.html"));

var handlers = {
    handle_post : function(req,res){
        var data = [], dataLen = 0;
        req.on('data', function(chunk){
            data.push(chunk);
            dataLen += chunk.length;
        });
        req.on('end', function(){
            var buf = new Buffer(dataLen);
            for(var i=0,len=data.length, pos=0; i<len; i++){
                data[i].copy(buf,pos);
                pos += data[i].length;
            }
            var urlData = url.parse(req.url);
            var queryParameters = querystring.parse(urlData.query);
            io.sockets.in(queryParameters.ref).emit('data',buf.toString());
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end(buf.toString());
        });
    },
    handle_get : function(req,res){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.end(clientHtml);
    }
}

var server = http.createServer(function(req,res){
    var method = req.method.toLowerCase();    
    var handler = handlers['handle_'+method];
    if(handler != null){
        handler(req,res);
    }else{
        res.writeHead(405);
        res.end('Method not allowed');
    }
})
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('room', function (room) {
        socket.join(room);
    });
});

server.listen(8000);
