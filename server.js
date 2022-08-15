const app = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: true,
  origin: ["http://localhost:3000", "*", "https://swift-chat.netlify.app/"],
});
const port = process.env.PORT || 4000;

const users = { debs_admin: { name: "debs_admin", color: "teal" } };
const names = ["debs_admin"];
const chatHistory = [
  {
    color: "teal",
    dateSent: 1660501068503,
    msg: "Enjoy",
    name: "debs_admin",
    senderId: "WtyB3Gix_bPfa9UbAAAH",
  },
];
const sendNames = () => {
  const available = [];
  Object.values(users).map((item) => available.push(item.name));
  io.emit("in-chat", available);
};
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
      users[name] = { name: name, color: color, id: socket.id };
    }
    console.log(users);
    io.emit("response",socket.id, response);
  });

  socket.on("msgSent", (name, msg, dateSent) => { 
    let color = users[name].color;
    chatHistory.push({ name, msg, color, senderId: users[name].id, dateSent });
    io.emit("message", chatHistory);
    // io.emit("message", name, msg, color, users[name].id, dateSent);
    sendNames();
  });
  socket.on("get-details", (id) => {
    io.to(socket.id).emit("details", socket.id, id, chatHistory);
    sendNames();
  });
});

http.listen(port, function () {
  console.log("listening on:", port);
});
//Set-ExecutionPolicy RemoteSigned
