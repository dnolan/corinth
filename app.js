const path = require("path");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get("/", (req, res) => res.sendFile("index.html", {
  root: path.join(__dirname, 'public')
}));

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on("added user", function (username) {
    if (addedUser) return;

    socket.username = username;
    addedUser = true;
    numUsers++;

    socket.broadcast.emit("player joined", {
      username: username,
      total: numUsers
    });

  });

  socket.on("rolled", function (rolls) {
    rolls.name = socket.username;
    socket.broadcast.emit("rolled", rolls);
  });

  socket.on("disconnect", function () {
    socket.broadcast.emit("message", `User ${socket.username} disconnected`);
  })
});

app.use(express.static('public'));

http.listen(port, () => {
  console.log(`Corinth listening on port ${port}!`)
});

console.log("Server running at http://localhost:%d", port);
