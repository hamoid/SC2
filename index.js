var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http); 
var osc = require("osc");


var udpPort = new osc.UDPPort({
    localAddress: "192.168.3.24",
    localPort: 9000,

    remoteAddress: "192.168.3.150",
    remotePort: 9001
});

udpPort.open();
console.log(udpPort);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    //io.emit('chat message', msg);

    var oscMsg = {
        address: "/par1",
        args: [msg]
    };

    console.log("Sending message", oscMsg.address, oscMsg.args, "to", 
                udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);

    udpPort.send(oscMsg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



