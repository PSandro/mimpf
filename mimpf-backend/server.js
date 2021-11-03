const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  path: '/ws/',
  serveClient: false,
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  }
});

io.on("connection", (socket) => {
  console.log('a user connected');

  socket.on('pingServer', () => {
    socket.emit('pong', 'pong');
  });

});

httpServer.listen(3000);
