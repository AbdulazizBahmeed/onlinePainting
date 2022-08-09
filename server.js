const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const { fork } = require("child_process");
const { dirname } = require("path");
const controller = new AbortController();
const { signal } = controller;
const port = process.env.PORT || 3000;
const io = socket(app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  })
);
//middlewares
app.use(express.static("public"));
app.use(cookieParser());

app.get("/a", (req,res)=>{
  res.send(req.ip);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"public/homePage.html"));
});

app.get("/computeFibo/:number", (req, res) => {
  computeFibo(res, req.params.number);
});

app.get("/chatroom", loginRequired, (req, res) => {
  res.sendFile(path.join(__dirname, "public/chat.html"));
});

function loginRequired(req, res, next) {
  const username = req.cookies.username;
  // res.cookie("username","ahmedddd");
  if (username) {
    next();
  } else {
    res.redirect("/");
  }
}

io.sockets.on("connection", (socket) => {
  const username = parseCookie(socket.handshake.headers.cookie).username;

  socket.broadcast.emit("receive", {
    time: socket.handshake.headers.time,
    username: username,
    msg: "Entered tha chat!!!",
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("receive", {
      time: "!!!!!",
      username: username,
      msg: "disconnected from the chat!!!",
    });
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


function computeFibo(res, number) {
  const fiboProcess = fork(__dirname + "/fibo.js", [`${number}`], { signal });

  fiboProcess.on("error", (error) => {
    res.sendStatus(500);
  });

  fiboProcess.on("message", (data) => {
    res.send({ data });
  });

  fiboProcess.on("close", () => {
    console.log(`im done from ${number}`);
  });
}
