const express = require("express");
const app = express();
const path = require("path");
const socket = require("socket.io");
const port = process.env.PORT || 3000;
const io = socket(
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  })
);
usersOnline = 0;
//middlewares
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/painting.html"));
});

io.sockets.on("connection", (socket) => {
  socket.emit("join", { users: ++usersOnline });

  socket.on("disconnect", () => {
    usersOnline--;
    socket.broadcast.emit("left");
  });

  socket.on("send", (data) => {
    socket.broadcast.emit("receive", data);
  });
});
