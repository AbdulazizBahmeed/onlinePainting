const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const socket = require("socket.io");
const port = process.env.PORT || 3000;

//middleware
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/homePage.html"));
});

function loginRequired(req, res, next) {
  const username = req.cookies.username;
  if (username) {
    next();
  } else {
    res.redirect("/");
  }
}
app.get("/chatroom", loginRequired, (req, res) => {
  res.clearCookie("username");
  res.sendFile(path.join(__dirname, "public/chat.html"));
});

const io = socket(
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);

io.sockets.on("connection", (socket) => {
  const username = parseCookie(socket.handshake.headers.cookie).username;

  const time = socket.handshake.headers.time;
  const msg = `Entered tha chat!!!`;
  const connectionData = { time: time, username: username, msg: msg };
  socket.broadcast.emit("receive", connectionData);

  socket.on("disconnect", () => {
    const disconnectionData = { time: time, username: username, msg: msg };
    disconnectionData.msg = "disconnected from the chat!!!";
    socket.broadcast.emit("receive", disconnectionData);
  });

  socket.on("send", (data) => {
    socket.broadcast.emit("receive", data);
  });
});

function parseCookie(cookie) {
  cookie = '{"' + cookie.replace("=", '":"') + '"}';
  cookie = cookie.replace(";", ",");
  cookie = JSON.parse(cookie);
  return cookie;
}
