const PORT = 4321;
var socket = require('socket.io')(PORT);
socket.on('connection', function(client) {

    console.log("new connection")

    // Listen for test and disconnect events
    client.on('test', onTest);
    client.on('disconnect', onDisconnect);

    // Handle a test event from the client
    function onTest(data) {
        console.log('Received: "' + data + '" from client: ' + client.id);
        client.emit('test', "Cheers, " + client.id);
    }

    // Handle a disconnection from the client
    function onDisconnect() {
        console.log('Received: disconnect event from client: ' + client.id);
        client.removeListener('test', onTest);
        client.removeListener('disconnect', onDisconnect);
    }
});
