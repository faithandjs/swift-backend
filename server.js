const app = require("express");
// const { get } = require('https');
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
 
const users = {};
const names = [];
const nameColorPair = {};

io.on("connection", (socket) => {
  socket.on("username", (name) => {
    let response;
    if (names.includes(name)) {
      response = false;
    } else {
      response = true;
      names.push(name);
      users[socket.id] = name;
      io.to(socket.id).emit("my-id", socket.id);
      nameColorPair[socket.id] = Math.floor(Math.random() * 7 + 1);
      io.emit("in-chat", Object.values(users));

      console.log(users);
      console.log(names);
      console.log( Object.values(users)); 
    }
    console.log(response); 
    io.emit("response", response);
  });

  socket.on("msgSent", (name, msg, myId ) => {
    let colorCode = nameColorPair[myId];
    io.emit("message",  name, msg, colorCode, myId );
    io.emit("in-chat", Object.values(users));
  });
});

http.listen(4000, function () {
  console.log("listening");
});
//Set-ExecutionPolicy RemoteSigned
