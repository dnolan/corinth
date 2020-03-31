const path = require("path");
const express = require('express');
const app = express();
const port = 3000;

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get("/", (req, res) => res.sendFile("index.html", {
  root: path.join(__dirname, 'public')
}));

io.on('connection', function (socket) {
  console.log('a user connected');
});

app.use(express.static('public'));

http.listen(port, () => {
  console.log(`Corinth listening on port ${port}!`)
});


