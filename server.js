const app = require("express");
// const { get } = require('https');
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: true,
  origin: ["http://localhost:3000", "https://swift-chat.netlify.app/"],
});
const port = process.env.PORT || 4000;

const users = { WtyB3Gix_bPfa9UbAAAH: "debs_admin" };
const names = [];
const chatHistory = [
  {
    color: "teal",
    dateSent: 1660501068503,
    msg: "Enjoy",
    name: "debs_admin",
    senderId: "WtyB3Gix_bPfa9UbAAAH",
  },
];

const nameColorPair = {};
let i = 0;
io.on("connection", (socket) => {
  socket.on("username", (name) => {
    let response;
    if (names.includes(name.toLowerCase())) {
      response = false;
    } else {
      response = true;
      names.push(name.toLowerCase());
      let color;
      switch (Math.floor(Math.random() * 7 + 1)) {
        case 1:
          color = "teal";
          break;
        case 2:
          color = "green";
          break;
        case 3:
          color = "orange";
          break;
        case 4:
          color = "pink";
          break;
        case 5:
          color = "purple";
          break;
        case 6:
          color = "blue";
          break;
        case 7:
          color = "deep-blue";
          break;
      }
      nameColorPair[socket.id] = color;
      users[socket.id] = name;
    }
    io.emit("response", response, socket.id);
  });

  socket.on("msgSent", (name, msg, myId, dateSent) => {
    let color = nameColorPair[myId];
    chatHistory.push({ name, msg, color, senderId: myId, dateSent });
    io.emit("message", name, msg, color, myId, dateSent);
    io.emit("in-chat", Object.values(users));
  });
  socket.on("get-details", (id) => {
    io.to(socket.id).emit("details", socket.id, chatHistory);
    io.emit("in-chat", Object.values(users));
  });
});

http.listen(port, function () {
  console.log("listening on:", port);
});
//Set-ExecutionPolicy RemoteSigned
