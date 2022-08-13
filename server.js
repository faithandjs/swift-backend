const app = require("express");
// const { get } = require('https');
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const users = { WtyB3Gix_bPfa9UbAAAH: "debs_admin" };
const chatHistory = [
  {
    color: "teal",
    dateSent: 1529656291000,
    msg: "The year is 2020",
    name: "debs_admin",
    senderId: "WtyB3Gix_bPfa9UbAAAH",
  },
  {
    color: "teal",
    dateSent: 1592814691000,
    msg: "hello 2021",
    name: "debs_admin",
    senderId: "WtyB3Gix_bPfa9UbAAAH",
  },
];

const nameColorPair = {};
let i = 0;
io.on("connection", (socket) => {
  // socket.onAny((eventName, ...args) => {
  //   io.emit("in-chat", Object.values(users));
  // });
  socket.on("username", (name) => {
    let response;
    if (Object.values(users).includes(name)) {
      response = false;
    } else {
      console.log(name);
      response = true;
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
      io.to(socket.id).emit("details", socket.id, chatHistory);
      io.emit("in-chat", Object.values(users));
    }
    io.emit("response", response);
  });

  socket.on("msgSent", (name, msg, myId, dateSent) => {
    let color = nameColorPair[myId];
    chatHistory.push({ name, msg, color, senderId: myId, dateSent });
    io.emit("message", name, msg, color, myId, dateSent);
    io.emit("in-chat", Object.values(users));
  });
});

http.listen(4000, function () {
  console.log("listening");
});
//Set-ExecutionPolicy RemoteSigned
