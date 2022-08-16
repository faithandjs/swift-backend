const app = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: true,
  origin: ["http://localhost:3000", "*", "https://swift-chat.netlify.app/"],
});
const port = process.env.PORT || 4000;

const users = {
  debs_admin: {
    name: "debs_admin",
    color: "teal",
    avatar: "/static/media/avataaars (1).66edf8ec36b7a3b93ed1.png",
    id: ''
  },
};
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
  io.emit("in-chat", available,  Object.values(users));
};
io.on("connection", (socket) => { 
  socket.on("username", (name) => {
    const response = names.includes(name.toLowerCase()) ? false : true;
    io.emit("response", socket.id, response);
  });
  socket.on("register", (name, avatar) => {
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
    users[name] = { name: name, color: color, id: socket.id, avatar: avatar };
    console.log(users);
    sendNames();
  });
  socket.on("msgSent", (name, msg, dateSent, avatar) => {
    if(users[name] === undefined){
      socket.emit('reset')
      return;
    }
    let color = users[name].color;
    chatHistory.push({
      name,
      msg,
      color,
      senderId: users[name].id,
      dateSent,
      avatar,
    });
    io.emit("message", chatHistory);
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
